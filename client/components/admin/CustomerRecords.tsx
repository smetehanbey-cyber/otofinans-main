import { useState, useEffect } from "react";
import { supabase, Customer } from "@/lib/supabase";
import { Archive, Edit2, Plus, ChevronUp, ChevronDown, FileText, Smartphone, MessageSquare, X, Send } from "lucide-react";
import DocumentUploadModal from "./DocumentUploadModal";

interface LoggedInUser {
  id: number;
  name: string;
  pin: string;
  is_admin: boolean;
}

interface ChatMessage {
  id: string;
  sender_name: string;
  receiver_name: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Authorized persons list
const AUTHORIZED_PERSONS = ["Beyza", "Duygu", "Erkut", "Gökhan", "Mete"];

// Turkish-aware uppercase function
const toTurkishUpperCase = (str: string): string => {
  const turkishMap: { [key: string]: string } = {
    'i': 'İ',
    'ş': 'Ş',
    'ğ': 'Ğ',
    'ü': 'Ü',
    'ö': 'Ö',
    'ç': 'Ç'
  };

  return str
    .split('')
    .map(char => turkishMap[char] || char.toUpperCase())
    .join('');
};

export default function CustomerRecords({ loggedInUser }: { loggedInUser: LoggedInUser | null }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<Customer | Partial<Customer>>({});
  const [showForm, setShowForm] = useState(false);
  const [archiveConfirmId, setArchiveConfirmId] = useState<number | null>(null);
  const [openedNoteCardId, setOpenedNoteCardId] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, bottom: 0, left: 0, showBelow: true });
  const [closeMessageTooltipTimeout, setCloseMessageTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [selectedCustomerForDocs, setSelectedCustomerForDocs] = useState<number | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    tc: "",
    phone: "",
    message: "",
    process: "Beklemede" as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade"
  });
  const [sortField, setSortField] = useState<keyof Customer>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuthorizedPerson, setSelectedAuthorizedPerson] = useState<string | null>(null);
  const [showAuthorizedPersonDropdown, setShowAuthorizedPersonDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [animatingIds, setAnimatingIds] = useState<Set<number>>(new Set());
  const [newNoteText, setNewNoteText] = useState("");
  const [expandedNotesId, setExpandedNotesId] = useState<number | null>(null);
  const [showNoteInputId, setShowNoteInputId] = useState<number | null>(null);
  const [newNoteInputText, setNewNoteInputText] = useState("");
  const [addingNoteFromHoverId, setAddingNoteFromHoverId] = useState<number | null>(null);
  const [hoverNoteInputText, setHoverNoteInputText] = useState("");
  const [closeTooltipTimeout, setCloseTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [hoveredProcessId, setHoveredProcessId] = useState<number | null>(null);
  const [processTooltipPos, setProcessTooltipPos] = useState({ top: 0, left: 0 });
  const [editingProcessId, setEditingProcessId] = useState<number | null>(null);
  const [closeProcessTooltipTimeout, setCloseProcessTooltipTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [dateFilterStart, setDateFilterStart] = useState("");
  const [dateFilterEnd, setDateFilterEnd] = useState("");
  const [notifications, setNotifications] = useState<Array<{id: string; customerId: number; customerName: string; author: string; noteText: string; timestamp: string; isProcessChange?: boolean}>>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageWindows, setMessageWindows] = useState<{[key: string]: {minimized: boolean; unread: number}} | undefined>(undefined);
  const [unreadByUser, setUnreadByUser] = useState<{[key: string]: number}>({});
  const [authorizedPersons, setAuthorizedPersons] = useState<string[]>([]);
  const [windowPositions, setWindowPositions] = useState<{[key: string]: {x: number; y: number}}>({});
  const [draggedWindow, setDraggedWindow] = useState<{person: string; offsetX: number; offsetY: number} | null>(null);
  const [showPersonList, setShowPersonList] = useState(false);

  // Fetch active customers only
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("customers")
        .select("*, added_by")
        .eq("status", "active")
        .order(sortField, { ascending: sortOrder === "asc" });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Network/Database Error Details:", errorMsg);

      // Show user-friendly message
      if (errorMsg.includes("Failed to fetch")) {
        console.error("Unable to connect to Supabase. Check your internet connection or Supabase service status.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch when sort changes
  useEffect(() => {
    fetchCustomers();
  }, [sortField, sortOrder]);

  // Load chat messages from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error("Error loading chat messages from localStorage:", error);
    }
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Real-time subscription to customers table
  useEffect(() => {
    let channel: any;
    let notificationChannel: any;

    const setupRealtime = () => {
      try {
        channel = supabase
          .channel("customers-updates")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "customers" },
            (payload) => {
              // Only update if the changed record is active
              if (payload.new?.status === "active" || payload.old?.status === "active") {
                // Update only the changed customer row instead of fetching all
                if (payload.new) {
                  setCustomers(prevCustomers => {
                    const existingIndex = prevCustomers.findIndex(c => c.id === payload.new.id);
                    if (existingIndex >= 0) {
                      // Update existing customer
                      const updated = [...prevCustomers];
                      updated[existingIndex] = payload.new;
                      return updated;
                    } else {
                      // Add new customer if not in list
                      return [...prevCustomers, payload.new];
                    }
                  });
                } else if (payload.old?.id) {
                  // Remove deleted customer
                  setCustomers(prevCustomers =>
                    prevCustomers.filter(c => c.id !== payload.old.id)
                  );
                }
              }
            }
          )
          .subscribe();

        // Listen for note and process change broadcast notifications
        notificationChannel = supabase
          .channel('note_notifications')
          .on('broadcast', { event: 'note_added' }, (message) => {
            // Update the customer row with new note data
            if (message.payload.customerData) {
              setCustomers(prevCustomers => {
                const existingIndex = prevCustomers.findIndex(c => c.id === message.payload.customerId);
                if (existingIndex >= 0) {
                  const updated = [...prevCustomers];
                  updated[existingIndex] = message.payload.customerData;
                  return updated;
                }
                return prevCustomers;
              });
            }

            // Only show notification if current user is not the one who added the note
            if (message.payload.author !== loggedInUser?.name) {
              const notifId = `${Date.now()}-${Math.random()}`;
              const newNotification = {
                id: notifId,
                customerId: message.payload.customerId,
                customerName: message.payload.customerName,
                author: message.payload.author,
                noteText: message.payload.noteText,
                timestamp: message.payload.timestamp
              };

              setNotifications(prev => [...prev, newNotification]);

              // Auto-remove notification after 16 seconds
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notifId));
              }, 16000);
            }
          })
          .on('broadcast', { event: 'process_changed' }, (message) => {
            // Update the customer row with new process and message data
            if (message.payload.customerData) {
              setCustomers(prevCustomers => {
                const existingIndex = prevCustomers.findIndex(c => c.id === message.payload.customerId);
                if (existingIndex >= 0) {
                  const updated = [...prevCustomers];
                  updated[existingIndex] = message.payload.customerData;
                  return updated;
                }
                return prevCustomers;
              });
            }

            // Only show notification if current user is not the one who changed the process
            if (message.payload.author !== loggedInUser?.name) {
              const notifId = `${Date.now()}-${Math.random()}`;
              const newNotification = {
                id: notifId,
                customerId: message.payload.customerId,
                customerName: message.payload.customerName,
                author: message.payload.author,
                noteText: `Süreci değiştirdi: ${message.payload.newProcess}`,
                timestamp: message.payload.timestamp,
                isProcessChange: true
              };

              setNotifications(prev => [...prev, newNotification]);

              // Auto-remove notification after 16 seconds
              setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== notifId));
              }, 16000);
            }
          })
          .subscribe();
      } catch (error) {
        console.error("Error setting up realtime subscription:", error);
      }
    };

    setupRealtime();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      if (notificationChannel) {
        supabase.removeChannel(notificationChannel);
      }
    };
  }, [loggedInUser?.name]);

  // Request notification permission and setup chat
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Set authorized persons list
    setAuthorizedPersons(AUTHORIZED_PERSONS);

    // Setup chat message listener
    let chatChannel: any;
    const setupChat = () => {
      try {
        chatChannel = supabase
          .channel('chat_messages')
          .on('broadcast', { event: 'new_message' }, (message) => {
            const msg = message.payload;

            // Only add message if it's for current user (receiver) or from current user (sender)
            if (msg.receiver_name === loggedInUser?.name || msg.sender_name === loggedInUser?.name) {
              const newMsg: ChatMessage = {
                id: msg.id,
                sender_name: msg.sender_name,
                receiver_name: msg.receiver_name,
                message: msg.message,
                timestamp: msg.timestamp,
                read: msg.sender_name === loggedInUser?.name
              };

              setChatMessages(prev => {
                const updated = [...prev, newMsg];
                // Save to localStorage
                localStorage.setItem('chatMessages', JSON.stringify(updated));
                return updated;
              });

              // Play notification sound if received message
              if (msg.receiver_name === loggedInUser?.name && msg.sender_name !== loggedInUser?.name) {
                playMessageSound();
                const senderName = msg.sender_name;

                // Create or open message window
                setMessageWindows(prev => ({
                  ...prev,
                  [senderName]: {
                    minimized: true,
                    unread: (prev?.[senderName]?.unread || 0) + 1
                  }
                }));

                setUnreadByUser(prev => ({
                  ...prev,
                  [senderName]: (prev[senderName] || 0) + 1
                }));
              }
            }
          })
          .subscribe();
      } catch (error) {
        console.error("Error setting up chat:", error);
      }
    };

    setupChat();

    return () => {
      if (chatChannel) {
        supabase.removeChannel(chatChannel);
      }
    };
  }, [loggedInUser?.name]);

  // Handle window dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedWindow && messageWindows && messageWindows[draggedWindow.person]) {
        const newX = e.clientX - draggedWindow.offsetX;
        const newY = window.innerHeight - e.clientY - draggedWindow.offsetY;
        setWindowPositions(prev => ({
          ...prev,
          [draggedWindow.person]: { x: Math.max(0, newX), y: Math.max(0, newY) }
        }));
      }
    };

    const handleMouseUp = () => {
      setDraggedWindow(null);
    };

    if (draggedWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedWindow, messageWindows]);

  // Play notification sound
  const playMessageSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Send chat message
  const handleSendMessage = async (receiverName: string, message: string) => {
    if (!message.trim()) return;

    const messageData = {
      id: `${Date.now()}-${Math.random()}`,
      sender_name: loggedInUser?.name || "Bilinmeyen",
      receiver_name: receiverName,
      message: message,
      timestamp: new Date().toLocaleString("tr-TR"),
      read: true
    };

    setChatMessages(prev => {
      const updated = [...prev, messageData];
      // Save to localStorage
      localStorage.setItem('chatMessages', JSON.stringify(updated));
      return updated;
    });

    // Broadcast message to other users
    await supabase
      .channel('chat_messages')
      .send({
        type: 'broadcast',
        event: 'new_message',
        payload: messageData
      })
      .catch(err => console.log("Message sent:", err));
  };

  // Add new customer
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.tc) {
      alert("Ad ve TC zorunludur!");
      return;
    }

    try {
      // Check if phone number already exists
      if (newCustomer.phone) {
        const { data: existingCustomer, error: checkError } = await supabase
          .from("customers")
          .select("id, phone")
          .eq("phone", newCustomer.phone)
          .eq("status", "active")
          .single();

        if (existingCustomer) {
          alert("Bu telefon numarasında kayıt zaten mevcut!");
          return;
        }
      }

      const { data: newCustomerData, error } = await supabase
        .from("customers")
        .insert([
          {
            name: newCustomer.name,
            tc: newCustomer.tc,
            phone: newCustomer.phone || "",
            message: newCustomer.message || "",
            process: newCustomer.process,
            status: "active",
            added_by: loggedInUser?.name || "Bilinmeyen"
          }
        ])
        .select();

      if (error) throw error;

      // Add the new customer to state instead of fetching all
      if (newCustomerData && newCustomerData.length > 0) {
        setCustomers(prevCustomers => [newCustomerData[0], ...prevCustomers]);
      }

      setNewCustomer({ name: "", tc: "", phone: "", message: "", process: "Beklemede" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding customer:", error);
      alert("Hata: Müşteri eklenemedi. Lütfen formu kontrol edin.");
    }
  };

  // Update customer
  const handleUpdateCustomer = async (id: number) => {
    if (!editingData.name || !editingData.tc) {
      alert("Ad ve TC zorunludur!");
      return;
    }

    try {
      // Only send the fields that have changed
      const updateData: any = {
        name: editingData.name,
        tc: editingData.tc,
        phone: editingData.phone || "",
        message: editingData.message || "",
        process: editingData.process || "Beklemede"
      };

      // Handle notes updates - only include if notes exist
      if (editingData.notes !== undefined && editingData.notes.length > 0) {
        updateData.notes = editingData.notes;
      }

      // Only allow admins to update added_by field
      if (loggedInUser?.is_admin) {
        updateData.added_by = editingData.added_by || "";
      }

      const { data: updatedCustomer, error } = await supabase
        .from("customers")
        .update({ ...updateData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error details:", error);

        // If error is about notes column not existing, try again without notes
        if (error.message && error.message.includes("notes")) {
          console.log("Notes column not found, updating without notes...");
          delete updateData.notes;

          const { data: retryData, error: retryError } = await supabase
            .from("customers")
            .update({ ...updateData, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();

          if (retryError) throw retryError;

          // Update state with returned data
          if (retryData) {
            setCustomers(prevCustomers =>
              prevCustomers.map(c => c.id === id ? retryData : c)
            );
          }
        } else {
          throw error;
        }
      } else if (updatedCustomer) {
        // Update only this customer in state
        setCustomers(prevCustomers =>
          prevCustomers.map(c => c.id === id ? updatedCustomer : c)
        );
      }

      setEditingId(null);
      setEditingData({});
    } catch (error) {
      console.error("Error updating customer:", error);
      alert("Hata: Müşteri güncellenemedi. Lütfen formu kontrol edin.");
    }
  };

  // Archive customer
  const handleArchiveCustomer = async () => {
    if (archiveConfirmId === null) return;

    try {
      const { error } = await supabase
        .from("customers")
        .update({ status: "archived" })
        .eq("id", archiveConfirmId);

      if (error) throw error;
      setArchiveConfirmId(null);
      fetchCustomers();
    } catch (error) {
      console.error("Error archiving customer:", error);
      alert("Hata: Müşteri arşivlenemedi");
      setArchiveConfirmId(null);
    }
  };

  // Update process status
  const handleUpdateProcess = async (id: number, process: "Beklemede" | "Onaylandı" | "Kredi Onayda") => {
    try {
      const { error } = await supabase
        .from("customers")
        .update({ process })
        .eq("id", id);

      if (error) throw error;
      fetchCustomers();
    } catch (error) {
      console.error("Error updating process:", error);
      alert("Hata: Durum güncellenemedi");
    }
  };

  // Add a new note to a customer
  const handleAddNote = (customerId: number, noteText: string) => {
    if (!noteText.trim()) return;

    const timestamp = new Date().toLocaleString("tr-TR");
    const newNote = {
      text: noteText.trim(),
      timestamp,
      author: loggedInUser?.name || "Bilinmeyen"
    };

    const currentNotes = editingData.notes || [];
    setEditingData({
      ...editingData,
      notes: [...currentNotes, newNote]
    });

    setNewNoteInputText("");
    setShowNoteInputId(null);
  };

  // Add a new note directly from the hover tooltip (no edit mode needed)
  const handleAddNoteFromHover = async (customerId: number, noteText: string) => {
    if (!noteText.trim()) return;

    try {
      const timestamp = new Date().toLocaleString("tr-TR");
      const newNote = {
        text: noteText.trim(),
        timestamp,
        author: loggedInUser?.name || "Bilinmeyen"
      };

      const customer = customers.find(c => c.id === customerId);
      const currentNotes = customer?.notes || [];
      const updatedNotes = [...currentNotes, newNote];

      // Update local state immediately (optimistic update)
      setCustomers(customers.map(c =>
        c.id === customerId
          ? { ...c, notes: updatedNotes }
          : c
      ));

      // Clear input
      setHoverNoteInputText("");

      // Update in database (async, in background) and fetch updated customer
      const { data: updatedCustomer, error } = await supabase
        .from("customers")
        .update({ notes: updatedNotes, updated_at: new Date().toISOString() })
        .eq("id", customerId)
        .select()
        .single();

      if (error) {
        console.error("Error saving note to database:", error);
        // If notes column doesn't exist, show helpful message
        if (error.message && error.message.includes("notes")) {
          alert("Not: Supabase veritabanında 'notes' sütunu eklenmelidir. Lütfen yöneticiyle iletişime geçiniz.");
        } else {
          throw error;
        }
      }

      // Trigger broadcast notification to other users
      const broadcastMessage = {
        type: 'note_added',
        customerId: customerId,
        customerName: customer?.name || "Bilinmeyen",
        author: loggedInUser?.name || "Bilinmeyen",
        noteText: noteText.trim(),
        timestamp: timestamp,
        customerData: updatedCustomer // Send updated customer data for real-time sync
      };

      // Broadcast via Supabase Realtime
      await supabase
        .channel('note_notifications')
        .send({
          type: 'broadcast',
          event: 'note_added',
          payload: broadcastMessage
        })
        .then(() => {
          // Successfully sent, no need to do anything
        })
        .catch(err => {
          console.log("Note broadcast sent (may fail if channel not ready):", err);
        });
    } catch (error) {
      console.error("Error adding note from hover:", error);
      alert("Not eklenirken hata oluştu: " + (error instanceof Error ? error.message : "Bilinmeyen hata"));
    }
  };

  // Delete a note from a customer
  const handleDeleteNote = async (customerId: number, noteIndex: number) => {
    try {
      const customer = customers.find(c => c.id === customerId);
      const currentNotes = customer?.notes || [];
      const noteToDelete = currentNotes[noteIndex];

      // Check permissions: only admin or note author can delete
      if (!loggedInUser?.is_admin && loggedInUser?.name !== noteToDelete?.author) {
        alert("Bu notu silme yetkiniz yok. Sadece kendi yorumlarınızı veya admin olarak tüm yorumları silebilirsiniz.");
        return;
      }

      const updatedNotes = currentNotes.filter((_, idx) => idx !== noteIndex);

      // Update in database
      const { error } = await supabase
        .from("customers")
        .update({ notes: updatedNotes })
        .eq("id", customerId);

      if (error) {
        if (error.message && !error.message.includes("notes")) {
          throw error;
        }
        console.log("Notes column not yet available in database");
      } else {
        // Update local state
        setCustomers(customers.map(c =>
          c.id === customerId
            ? { ...c, notes: updatedNotes }
            : c
        ));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Not silinirken hata oluştu");
    }
  };

  // Handle message cell click to open notes card
  const handleMessageClick = (customerId: number, e: React.MouseEvent) => {
    setOpenedNoteCardId(customerId);

    // Get the parent relative div (the container of the span and tooltip)
    const relativeDiv = (e.currentTarget as HTMLElement).closest('div.relative') as HTMLElement;

    if (relativeDiv) {
      const span = e.currentTarget as HTMLElement;
      const spanRect = span.getBoundingClientRect();
      const relativeDivRect = relativeDiv.getBoundingClientRect();

      // Calculate position relative to the parent relative div
      const topPos = spanRect.bottom - relativeDivRect.top + 5;
      const leftPos = spanRect.left - relativeDivRect.left;

      setTooltipPos({
        top: topPos,
        bottom: 0,
        left: leftPos,
        showBelow: true
      });
    }
  };

  // Handle note textarea Enter key - submit on Enter
  const handleNoteKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>, customerId: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNoteFromHover(customerId, hoverNoteInputText);
    }
  };

  // Handle process cell mouse enter - for quick edit
  const handleProcessMouseEnter = (customerId: number, e: React.MouseEvent) => {
    if (closeProcessTooltipTimeout) {
      clearTimeout(closeProcessTooltipTimeout);
      setCloseProcessTooltipTimeout(null);
    }

    setHoveredProcessId(customerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setProcessTooltipPos({
      top: rect.bottom + 5,
      left: rect.left
    });
  };

  // Handle process cell mouse leave
  const handleProcessMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredProcessId(null);
      setEditingProcessId(null);
    }, 300);
    setCloseProcessTooltipTimeout(timeout);
  };

  // Handle process tooltip mouse enter
  const handleProcessTooltipMouseEnter = () => {
    if (closeProcessTooltipTimeout) {
      clearTimeout(closeProcessTooltipTimeout);
      setCloseProcessTooltipTimeout(null);
    }
  };

  // Save process change
  const handleSaveProcessChange = async (customerId: number, newProcess: string) => {
    try {
      const customer = customers.find(c => c.id === customerId);

      const { data, error } = await supabase
        .from("customers")
        .update({ process: newProcess, updated_at: new Date().toISOString() })
        .eq("id", customerId)
        .select()
        .single();

      if (error) throw error;

      // Update only this customer in state (no full fetch needed)
      setCustomers(prevCustomers => {
        const updated = prevCustomers.map(c =>
          c.id === customerId ? { ...c, process: newProcess, updated_at: data.updated_at } : c
        );
        return updated;
      });

      setEditingProcessId(null);
      setHoveredProcessId(null);

      // Broadcast process change with full customer data for real-time sync
      const broadcastMessage = {
        type: 'process_changed',
        customerId: customerId,
        customerName: customer?.name || "Bilinmeyen",
        author: loggedInUser?.name || "Bilinmeyen",
        newProcess: newProcess,
        timestamp: new Date().toLocaleString("tr-TR"),
        customerData: data // Send updated customer data for other users
      };

      await supabase
        .channel('note_notifications')
        .send({
          type: 'broadcast',
          event: 'process_changed',
          payload: broadcastMessage
        })
        .catch(err => {
          console.log("Process change broadcast sent:", err);
        });
    } catch (error) {
      console.error("Error updating process:", error);
      alert("Süreci güncellerken hata oluştu");
    }
  };

  const handleSort = (field: keyof Customer) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortIcon = ({ field }: { field: keyof Customer }) => {
    if (sortField !== field) return <ChevronUp className="h-4 w-4 text-gray-300" />;
    return sortOrder === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  // Scroll to customer row when clicking view note
  const scrollToCustomer = (customerId: number) => {
    const customerElement = document.getElementById(`customer-row-${customerId}`);
    if (customerElement) {
      customerElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the row briefly
      customerElement.classList.add('row-animate');
      setTimeout(() => customerElement.classList.remove('row-animate'), 800);
    }
  };

  // Get unique authorized persons
  const uniqueAuthorizedPersons = Array.from(
    new Set(customers.map((c) => c.added_by).filter((name) => name))
  ).sort();

  // Filter customers based on search query and selected authorized person
  const filteredCustomers = customers.filter((customer) => {
    // Filter by selected authorized person
    if (selectedAuthorizedPerson && customer.added_by !== selectedAuthorizedPerson) {
      return false;
    }

    // Filter by date range
    if (dateFilterStart || dateFilterEnd) {
      // Extract date part without timezone conversion
      const customerDate = customer.created_at.split('T')[0];
      if (dateFilterStart && customerDate < dateFilterStart) {
        return false;
      }
      if (dateFilterEnd && customerDate > dateFilterEnd) {
        return false;
      }
    }

    const query = searchQuery.toLowerCase().trim();

    // If search query is empty, show all (after authorized person filter)
    if (!query) return true;

    // Search by name
    if (customer.name.toLowerCase().includes(query)) return true;

    // Search by full TC or last 9 digits of TC
    if (customer.tc.includes(query)) return true;
    const tcLast9 = customer.tc.slice(-9);
    if (tcLast9.includes(query)) return true;

    // Search by full phone or last 9 digits of phone
    if (customer.phone.includes(query)) return true;
    const phoneLast9 = customer.phone.slice(-9);
    if (phoneLast9.includes(query)) return true;

    return false;
  });

  return (
    <div className={`${isMobile ? "p-3" : "p-6"}`}>
      <style>{`
        @keyframes rowUpdate {
          0% {
            background-color: rgb(191 219 254);
          }
          100% {
            background-color: transparent;
          }
        }
        .row-animate {
          animation: rowUpdate 0.8s ease-out;
        }

        @keyframes slideInAndFade {
          0% {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .tooltip-animate {
          animation: slideInAndFade 0.3s ease-out;
        }

        .animate-slideInAndFade {
          animation: slideInAndFade 0.4s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>

      {/* Add Customer Button and Search */}
      {!showForm && (
        <div className={`mb-6 flex flex-col gap-2 ${isMobile ? "" : "sm:flex-row sm:gap-3"}`}>
          <button
            onClick={() => setShowForm(true)}
            className={`flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${isMobile ? "w-full sm:w-auto" : ""}`}
          >
            <Plus className={isMobile ? "h-4 w-4" : "h-5 w-5"} />
            {isMobile ? "Ekle" : "Yeni Müşteri Ekle"}
          </button>
          <input
            type="text"
            placeholder={isMobile ? "Ara..." : "TC, Ad veya Telefon ile ara..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm ${isMobile ? "w-full" : "flex-1"}`}
          />
        </div>
      )}

      {/* Add Customer Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-4">Yeni Müşteri Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Ad Soyad"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: toTurkishUpperCase(e.target.value) })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <input
              type="text"
              placeholder="TC"
              value={newCustomer.tc}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, tc: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <div className="relative flex items-center">
              <span className="absolute left-3 font-semibold text-gray-700 pointer-events-none" style={{fontSize: '15px'}}>0</span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="5XX XXX XX XX"
                value={newCustomer.phone.replace(/^\+90/, "")}
                onChange={(e) => {
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  const formattedPhone = digits ? `+90${digits.slice(0, 10)}` : "";
                  setNewCustomer({ ...newCustomer, phone: formattedPhone })
                }}
                maxLength="10"
                className="pl-12 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                style={{letterSpacing: '0.5px'}}
              />
            </div>
            <select
              value={newCustomer.process}
              onChange={(e) =>
                setNewCustomer({
                  ...newCustomer,
                  process: e.target.value as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade"
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="Beklemede">Beklemede</option>
              <option value="Aracını Buluyor">Aracını Buluyor</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Kredi Onayda">Kredi Onayda</option>
              <option value="Kullandırıldı">Kullandırıldı</option>
              <option value="Red/İade">Red/İade</option>
            </select>
            <textarea
              placeholder="Mesaj"
              value={newCustomer.message}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, message: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 col-span-2"
              rows={2}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddCustomer}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Kaydet
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewCustomer({ name: "", tc: "", phone: "", message: "", process: "Beklemede" });
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Aktif müşteri kaydı bulunamadı</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-6">Arama kriterlerine uygun müşteri bulunamadı</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDateFilterStart("");
              setDateFilterEnd("");
              setSelectedAuthorizedPerson(null);
              setShowDateFilter(false);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ← Geri (Filtreleri Temizle)
          </button>
        </div>
      ) : (
        <div className={`${isMobile ? "overflow-x-auto" : "overflow-x-auto"} min-h-[600px] relative`}>
          <table className={`w-full border-collapse ${isMobile ? "text-xs" : ""}`}>
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("name")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Ad {!isMobile && "Soyad"} <SortIcon field="name" />
                  </button>
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("tc")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    TC <SortIcon field="tc" />
                  </button>
                </th>
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("phone")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Telefon <SortIcon field="phone" />
                  </button>
                </th>
                {!isMobile && (
                  <th className="px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap" style={{fontSize: '15px'}}>
                    <button
                      onClick={() => handleSort("message")}
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      Mesaj <SortIcon field="message" />
                    </button>
                  </th>
                )}
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => handleSort("process")}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Süreci <SortIcon field="process" />
                  </button>
                </th>
                {!isMobile && (
                  <th
                    className="px-2 py-2 text-left font-semibold text-gray-700 whitespace-nowrap relative"
                    style={{fontSize: '15px'}}
                  >
                    <button
                      onClick={() => setShowDateFilter(!showDateFilter)}
                      className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                    >
                      Tarih <SortIcon field="created_at" />
                    </button>

                    {/* Date Filter Dropdown */}
                    {showDateFilter && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDateFilter(false)}
                        />
                        <div
                          className="absolute bg-white border border-gray-300 rounded-lg shadow-2xl z-50 p-4"
                          style={{
                            top: '100%',
                            left: '0',
                            marginTop: '4px',
                            minWidth: '320px'
                          }}
                        >
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Başlangıç Tarihi
                              </label>
                              <input
                                type="date"
                                value={dateFilterStart}
                                onChange={(e) => setDateFilterStart(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Bitiş Tarihi
                              </label>
                              <input
                                type="date"
                                value={dateFilterEnd}
                                onChange={(e) => setDateFilterEnd(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                              />
                            </div>

                            {/* Sort Order Selection */}
                            <div className="border-t border-gray-200 pt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Sıralama
                              </label>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setSortOrder("desc")}
                                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    sortOrder === "desc"
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  Yeniden Eskilere
                                </button>
                                <button
                                  onClick={() => setSortOrder("asc")}
                                  className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                    sortOrder === "asc"
                                      ? "bg-blue-600 text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  Eskiden Yeniye
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => {
                                  setDateFilterStart("");
                                  setDateFilterEnd("");
                                  setShowDateFilter(false);
                                }}
                                className="flex-1 px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors text-sm font-medium"
                              >
                                Temizle
                              </button>
                              <button
                                onClick={() => setShowDateFilter(false)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Getir
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </th>
                )}
                <th className={`px-2 py-2 text-left font-semibold text-gray-700 relative whitespace-nowrap`} style={{fontSize: isMobile ? '12px' : '15px'}}>
                  <button
                    onClick={() => setShowAuthorizedPersonDropdown(!showAuthorizedPersonDropdown)}
                    className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                  >
                    {isMobile ? "Y.K" : "Yetkili Kişi"} {selectedAuthorizedPerson && <span className={`text-white px-1 py-0.5 rounded-full ${isMobile ? "text-xs" : "text-xs"}`} style={{fontSize: '10px', backgroundColor: '#2563eb'}}>✓</span>}
                  </button>
                  {showAuthorizedPersonDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 min-w-max">
                      <button
                        onClick={() => {
                          setSelectedAuthorizedPerson(null);
                          setShowAuthorizedPersonDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm font-medium border-b"
                      >
                        Tüm Yetkili Kişiler
                      </button>
                      {uniqueAuthorizedPersons.map((person) => (
                        <button
                          key={person}
                          onClick={() => {
                            setSelectedAuthorizedPerson(person);
                            setShowAuthorizedPersonDropdown(false);
                          }}
                          className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                            selectedAuthorizedPerson === person ? 'bg-blue-100 font-semibold text-blue-700' : ''
                          }`}
                        >
                          {person}
                        </button>
                      ))}
                    </div>
                  )}
                </th>
                <th className="px-2 py-2 text-center font-semibold text-gray-700" style={{fontSize: '15px'}}>
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  id={`customer-row-${customer.id}`}
                  className={`border-b border-gray-200 transition-colors ${
                    customer.process === "Kullandırıldı"
                      ? "bg-green-100 hover:bg-green-200"
                      : "hover:bg-gray-50"
                  } ${animatingIds.has(customer.id) ? "row-animate" : ""}`}
                >
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editingData.name || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            name: toTurkishUpperCase(e.target.value)
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '15px'}}
                      />
                    ) : (
                      <span className="text-gray-800 block">{toTurkishUpperCase(customer.name)}</span>
                    )}
                  </td>
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <input
                        type="text"
                        value={editingData.tc || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            tc: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '15px'}}
                      />
                    ) : (
                      <span className="text-gray-800 block max-w-[100px] truncate">{isMobile ? customer.tc.slice(-9) : customer.tc}</span>
                    )}
                  </td>
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '15px'}}>
                    {editingId === customer.id ? (
                      <div className="relative flex items-center">
                        <span className="absolute left-1 font-semibold text-gray-700 pointer-events-none" style={{fontSize: isMobile ? '10px' : '13px'}}>0</span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="5XX XXX XX XX"
                          value={(editingData.phone || "").replace(/^\+90/, "")}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/[^0-9]/g, "");
                            const formattedPhone = digits ? `+90${digits.slice(0, 10)}` : "";
                            setEditingData({
                              ...editingData,
                              phone: formattedPhone
                            })
                          }}
                          maxLength="10"
                          className="pl-7 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                          style={{fontSize: isMobile ? '12px' : '15px', letterSpacing: '0.5px'}}
                        />
                      </div>
                    ) : (
                      <a
                        href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-800 active:text-gray-800 block no-underline"
                        style={{
                          fontSize: isMobile ? '12px' : '15px',
                          textDecoration: 'none',
                          color: 'inherit',
                          wordSpacing: '1px'
                        }}
                        onCopy={(e) => {
                          e.preventDefault();
                          const phoneClean = customer.phone.replace(/[^0-9]/g, '');
                          e.clipboardData?.setData('text/plain', phoneClean);
                        }}
                      >
                        <span style={{fontSize: isMobile ? '10px' : '13px'}}>0</span>
                        <span> </span>
                        {customer.phone.slice(3, 6)} {customer.phone.slice(6, 9)} {customer.phone.slice(9, 11)} {customer.phone.slice(11, 13)}
                      </a>
                    )}
                  </td>
                  {!isMobile && (
                    <td className="px-2 py-2 max-w-[150px]" style={{fontSize: '14px'}}>
                      {editingId === customer.id ? (
                        <textarea
                          value={editingData.message || ""}
                          onChange={(e) =>
                            setEditingData({
                              ...editingData,
                              message: e.target.value
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                          style={{fontSize: '14px'}}
                          rows={2}
                        />
                      ) : (
                        <div className="relative">
                          <span
                            className="text-gray-700 block truncate cursor-pointer select-none"
                            style={{
                              fontSize: '14px',
                              WebkitUserSelect: 'none',
                              MozUserSelect: 'none',
                              userSelect: 'none'
                            }}
                            onClick={(e) => handleMessageClick(customer.id, e)}
                          >
                            {customer.message || "-"}
                          </span>
                          {openedNoteCardId === customer.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => {
                                  setOpenedNoteCardId(null);
                                  setHoverNoteInputText("");
                                }}
                              />
                              <div
                                className="absolute bg-white border border-gray-300 rounded shadow-2xl z-[9999] min-w-[340px] max-w-sm overflow-hidden flex flex-col tooltip-animate"
                                style={{
                                  top: `${tooltipPos.top}px`,
                                  left: `${tooltipPos.left}px`,
                                  maxHeight: '500px'
                                }}
                              >
                              {/* Header with close button */}
                              <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b border-gray-200">
                                <p className="text-xs font-semibold text-gray-700">Mesaj & Notlar</p>
                                <button
                                  onClick={() => {
                                    setOpenedNoteCardId(null);
                                    setHoverNoteInputText("");
                                  }}
                                  className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Message Display */}
                              {customer.message && (
                                <div className="bg-gray-900 text-white p-3 border-b border-gray-200">
                                  <p className="text-sm break-words">{customer.message}</p>
                                </div>
                              )}

                              {/* Content Area - Notes */}
                              <div className="flex-1 overflow-y-auto p-3">
                                {/* Existing Notes */}
                                {customer.notes && customer.notes.length > 0 && (
                                  <>
                                    <p className="text-xs font-semibold text-gray-700 mb-2">Notlar:</p>
                                    <div className="space-y-2 mb-3">
                                      {customer.notes.slice().reverse().map((note, displayIdx) => {
                                        const actualIdx = customer.notes.length - 1 - displayIdx;
                                        const isLatest = displayIdx === 0;
                                        const canDelete = loggedInUser?.is_admin || loggedInUser?.name === note.author;
                                        return (
                                          <div key={actualIdx} className={`p-2 rounded flex justify-between items-start gap-2 group ${isLatest ? 'bg-blue-900 border border-blue-700' : 'bg-gray-600 border border-gray-500'}`}>
                                            <div className="flex-1">
                                              <p className={`text-white break-words font-medium`} style={{fontSize: '13px'}}>{note.text}</p>
                                              <p className={`${isLatest ? 'text-blue-200' : 'text-gray-200'} text-xs mt-1`}>{note.author} • {note.timestamp}</p>
                                            </div>
                                            {canDelete && (
                                              <button
                                                onClick={() => handleDeleteNote(customer.id, actualIdx)}
                                                className={`flex-shrink-0 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 ${isLatest ? 'text-red-300 hover:text-red-100 hover:bg-red-900' : 'text-red-200 hover:text-red-100 hover:bg-red-700'}`}
                                                title="Sil"
                                              >
                                                ✕
                                              </button>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </>
                                )}

                                {customer.notes && customer.notes.length === 0 && (
                                  <p className="text-xs text-gray-500 italic">Henüz not yok</p>
                                )}
                              </div>

                              {/* Add Note Form - Fixed at bottom */}
                              <div className="border-t border-gray-200 bg-gray-50 p-3">
                                <textarea
                                  value={hoverNoteInputText}
                                  onChange={(e) => setHoverNoteInputText(e.target.value)}
                                  onKeyDown={(e) => handleNoteKeyPress(e, customer.id)}
                                  placeholder="Not yazınız... (Enter ile ekleyin)"
                                  className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                  rows={2}
                                />
                              </div>

                              <div className="absolute bottom-full left-6 w-2 h-2 bg-white border-t border-l border-gray-300" style={{transform: 'rotate(45deg)'}}></div>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                  <td className="px-2 py-2 relative" style={{fontSize: isMobile ? '12px' : '14px'}}>
                    {editingId === customer.id ? (
                      <select
                        value={editingData.process || "Beklemede"}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            process: e.target.value as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade" | "Yeni Müşteri"
                          })
                        }
                        className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                        style={{fontSize: isMobile ? '12px' : '14px'}}
                      >
                        <option value="Beklemede">Beklemede</option>
                        <option value="Aracını Buluyor">Aracını Buluyor</option>
                        <option value="Onaylandı">Onaylandı</option>
                        <option value="Kredi Onayda">Kredi Onayda</option>
                        <option value="Kullandırıldı">Kullandırıldı</option>
                        <option value="Red/İade">Red/İade</option>
                        <option value="Yeni Müşteri">Yeni Müşteri</option>
                      </select>
                    ) : (
                      <div className="relative">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-semibold whitespace-nowrap cursor-pointer ${
                            customer.process === "Beklemede"
                              ? "bg-yellow-100 text-yellow-800"
                              : customer.process === "Aracını Buluyor"
                              ? "bg-orange-100 text-orange-800"
                              : customer.process === "Kredi Onayda"
                              ? "bg-blue-100 text-blue-800"
                              : customer.process === "Onaylandı"
                              ? "bg-green-100 text-green-800"
                              : customer.process === "Kullandırıldı"
                              ? "bg-green-800 text-white"
                              : customer.process === "Yeni Müşteri"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-pink-100 text-pink-800"
                          }`}
                          style={{fontSize: isMobile ? '11px' : '13px'}}
                          onClick={(e) => handleProcessMouseEnter(customer.id, e)}
                        >
                          {isMobile ? (customer.process === "Beklemede" ? "B" : customer.process === "Onaylandı" ? "O" : customer.process === "Kredi Onayda" ? "K" : customer.process === "Kullandırıldı" ? "U" : customer.process === "Yeni Müşteri" ? "Y" : "R") : customer.process}
                        </span>

                        {/* Click Dropdown for Process Edit */}
                        {hoveredProcessId === customer.id && (
                          <div
                            className="fixed bg-white border border-gray-300 rounded shadow-2xl z-[9999] min-w-[280px] max-w-sm overflow-hidden flex flex-col tooltip-animate"
                            style={{
                              top: `${processTooltipPos.top}px`,
                              left: `${processTooltipPos.left}px`
                            }}
                            onMouseEnter={() => handleProcessTooltipMouseEnter()}
                            onMouseLeave={() => handleProcessMouseLeave()}
                          >
                            <div className="flex justify-between items-center bg-gray-50 px-3 py-2 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-700">Süreci Değiştir:</p>
                              <button
                                onClick={() => {
                                  setHoveredProcessId(null);
                                }}
                                className="text-gray-500 hover:text-gray-700 text-lg leading-none"
                              >
                                ✕
                              </button>
                            </div>
                            <div className="p-3">
                              <select
                                value={customer.process}
                                onChange={(e) => {
                                  const newProcess = e.target.value as "Beklemede" | "Aracını Buluyor" | "Onaylandı" | "Kredi Onayda" | "Kullandırıldı" | "Red/İade" | "Yeni Müşteri";
                                  handleSaveProcessChange(customer.id, newProcess);
                                  setHoveredProcessId(null);
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                              >
                                <option value="Beklemede">Beklemede</option>
                                <option value="Aracını Buluyor">Aracını Buluyor</option>
                                <option value="Onaylandı">Onaylandı</option>
                                <option value="Kredi Onayda">Kredi Onayda</option>
                                <option value="Kullandırıldı">Kullandırıldı</option>
                                <option value="Red/İade">Red/İade</option>
                                <option value="Yeni Müşteri">Yeni Müşteri</option>
                              </select>
                            </div>
                            <div className="absolute bottom-full left-6 w-2 h-2 bg-white border-t border-l border-gray-300" style={{transform: 'rotate(45deg)'}}></div>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {!isMobile && (
                    <td className="px-2 py-2 text-gray-600" style={{fontSize: '14px'}}>
                      {new Date(customer.created_at).toLocaleDateString("tr-TR")}
                    </td>
                  )}
                  <td className="px-2 py-2" style={{fontSize: isMobile ? '12px' : '14px'}}>
                    {editingId === customer.id && loggedInUser?.is_admin ? (
                      <select
                        value={editingData.added_by || ""}
                        onChange={(e) =>
                          setEditingData({
                            ...editingData,
                            added_by: e.target.value
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        style={{fontSize: isMobile ? '12px' : '14px'}}
                      >
                        <option value="">Seçiniz...</option>
                        {AUTHORIZED_PERSONS.map((person) => (
                          <option key={person} value={person}>{person}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 whitespace-nowrap" style={{fontSize: isMobile ? '11px' : '13px'}}>
                        {customer.added_by || "-"}
                      </span>
                    )}
                  </td>
                  <td className="px-2 py-2">
                    <div className={`flex justify-center gap-1`}>
                      {editingId === customer.id ? (
                        <>
                          <button
                            onClick={() => handleUpdateCustomer(customer.id)}
                            className={`text-white rounded hover:opacity-80 transition-opacity ${isMobile ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-xs"}`}
                            style={{backgroundColor: '#16a34a', fontSize: isMobile ? '11px' : '13px'}}
                          >
                            {isMobile ? "K" : "Kaydet"}
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditingData({});
                            }}
                            className={`bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors ${isMobile ? "px-1 py-0.5 text-xs" : "px-2 py-1 text-xs"}`}
                            style={{fontSize: isMobile ? '11px' : '13px'}}
                          >
                            {isMobile ? "✕" : "İptal"}
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(customer.id);
                              setEditingData(customer);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                          </button>
                          <button
                            onClick={() => setSelectedCustomerForDocs(customer.id)}
                            className="p-1 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                            title="Dosyalar"
                          >
                            <FileText className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                          </button>
                          <button
                            onClick={() => setArchiveConfirmId(customer.id)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Arşive Taşı"
                          >
                            <Archive className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Total Count */}
      <div className={`mt-4 text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
        {selectedAuthorizedPerson ? (
          <>
            <span className="font-semibold">{selectedAuthorizedPerson}</span> tarafından eklenen: <span className="font-semibold">{filteredCustomers.length}</span> / Toplam: <span className="font-semibold">{customers.length}</span> müşteri
          </>
        ) : searchQuery ? (
          <>
            Bulunan: <span className="font-semibold">{filteredCustomers.length}</span> / Toplam: <span className="font-semibold">{customers.length}</span> müşteri
          </>
        ) : (
          <>
            Toplam: <span className="font-semibold">{customers.length}</span> aktif müşteri
          </>
        )}
      </div>

      {/* Document Upload Modal */}
      {selectedCustomerForDocs !== null && (
        <DocumentUploadModal
          customerId={selectedCustomerForDocs}
          isOpen={selectedCustomerForDocs !== null}
          onClose={() => setSelectedCustomerForDocs(null)}
        />
      )}

      {/* Archive Confirmation Modal */}
      {archiveConfirmId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-lg font-bold">Arşive Taşı</h2>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                <span className="font-semibold">Emin misin?</span>
                <br />
                Bu kayıt arşive taşınacak ve arşivde görünmeye başlayacak.
              </p>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setArchiveConfirmId(null)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hayır
                </button>
                <button
                  onClick={handleArchiveCustomer}
                  className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Evet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-[9998] space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`text-white rounded-lg shadow-lg p-4 animate-slideInAndFade ${notification.isProcessChange ? 'bg-purple-600' : 'bg-blue-600'}`}
          >
            <div className="flex justify-between items-start gap-2 mb-2">
              <div className="flex-1">
                <p className="text-sm font-semibold">
                  <span className="font-bold">{notification.author}</span> {notification.isProcessChange ? 'süreci güncelledi' : 'not ekledi'}
                </p>
                <p className={`text-xs mt-0.5 ${notification.isProcessChange ? 'text-purple-100' : 'text-blue-100'}`}>
                  {notification.customerName}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                className={`text-lg leading-none flex-shrink-0 hover:text-white ${notification.isProcessChange ? 'text-purple-200' : 'text-blue-200'}`}
              >
                ✕
              </button>
            </div>

            <div className={`rounded p-2 mb-3 text-xs max-h-12 overflow-y-auto ${notification.isProcessChange ? 'bg-purple-700' : 'bg-blue-700'}`}>
              <p className={notification.isProcessChange ? 'text-purple-100' : 'text-blue-100'}>{notification.noteText}</p>
            </div>

            <button
              onClick={() => {
                scrollToCustomer(notification.customerId);
                setNotifications(prev => prev.filter(n => n.id !== notification.id));
              }}
              className={`w-full px-3 py-1.5 text-white text-xs font-medium rounded transition-colors ${notification.isProcessChange ? 'bg-purple-500 hover:bg-purple-400' : 'bg-blue-500 hover:bg-blue-400'}`}
            >
              {notification.isProcessChange ? 'Kaydı Görüntüle' : 'Notu Görüntüle'}
            </button>
          </div>
        ))}
      </div>

      {/* Message Send Button - Bottom Left */}
      <div className="fixed bottom-4 left-4 z-[9997]">
        {/* User Selection Popup */}
        {showPersonList ? (
          <div className="bg-white rounded-lg shadow-2xl p-4 mb-4 border-t-4 border-green-600 max-w-xs animate-slideInAndFade">
            <p className="text-xs text-gray-600 mb-3 font-semibold">Mesaj Gönderilecek Kişi Seçin:</p>
            <div className="space-y-2">
              {authorizedPersons
                .filter(person => person !== loggedInUser?.name)
                .map((person, idx) => (
                  <button
                    key={person}
                    onClick={() => {
                      if (!messageWindows || !messageWindows[person]) {
                        setMessageWindows(prev => ({
                          ...(prev || {}),
                          [person]: { minimized: false, unread: 0 }
                        }));
                      } else {
                        setMessageWindows(prev => ({
                          ...prev,
                          [person]: { ...prev![person], minimized: false }
                        }));
                      }
                      setShowPersonList(false);
                    }}
                    className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-green-100 rounded transition-colors text-sm font-medium animate-slideInAndFade"
                    style={{
                      animationDelay: `${idx * 50}ms`
                    }}
                  >
                    {person}
                  </button>
                ))}
            </div>
          </div>
        ) : null}

        {/* Message Send Button */}
        <button
          onClick={() => {
            setShowPersonList(!showPersonList);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors font-medium"
        >
          Mesaj Gönder
        </button>
      </div>

      {/* Message Windows - Minimizable Cards */}
      {messageWindows && Object.entries(messageWindows).map(([personName, windowState], idx) => {
        const pos = windowPositions[personName] || { x: 16, y: 80 + idx * 320 };
        return (
          <div
            key={personName}
            className={`fixed z-[9996] bg-white rounded-lg shadow-2xl flex flex-col animate-slideInAndFade ${
              windowState.minimized ? 'h-14 cursor-move' : 'h-96'
            } ${draggedWindow?.person !== personName ? 'transition-all' : ''}`}
            style={{
              width: '300px',
              left: `${pos.x}px`,
              bottom: `${pos.y}px`,
              userSelect: 'none'
            }}
          >
            {/* Header */}
            <div
              className={`bg-blue-600 text-white p-3 flex justify-between items-center ${windowState.minimized ? 'rounded-lg' : 'rounded-t-lg'} cursor-pointer`}
              onClick={() => {
                setMessageWindows(prev => ({
                  ...prev,
                  [personName]: {
                    ...prev![personName],
                    minimized: !prev![personName].minimized,
                    unread: windowState.minimized ? 0 : prev![personName].unread
                  }
                }));
                if (windowState.minimized) {
                  setUnreadByUser(prev => ({
                    ...prev,
                    [personName]: 0
                  }));
                }
              }}
              onMouseDown={(e) => {
                if (windowState.minimized) {
                  const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                  const offsetX = e.clientX - rect.left;
                  const offsetY = e.clientY - rect.top;
                  setDraggedWindow({ person: personName, offsetX, offsetY });
                }
              }}
            >
              <h4 className={`font-semibold ${windowState.minimized && (unreadByUser[personName] || 0) > 0 ? 'animate-pulse' : ''}`}>
                {personName}
                {windowState.minimized && (unreadByUser[personName] || 0) > 0 && (
                  <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded-full inline-block">
                    {unreadByUser[personName]}
                  </span>
                )}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMessageWindows(prev => {
                    if (!prev) return undefined;
                    const newWindows = { ...prev };
                    delete newWindows[personName];
                    return Object.keys(newWindows).length === 0 ? undefined : newWindows;
                  });
                }}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages Area */}
            {!windowState.minimized && (
              <>
                <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
                  {chatMessages
                    .filter(msg =>
                      (msg.sender_name === loggedInUser?.name && msg.receiver_name === personName) ||
                      (msg.receiver_name === loggedInUser?.name && msg.sender_name === personName)
                    )
                    .map(msg => (
                      <div
                        key={msg.id}
                        className={`mb-2 flex ${msg.sender_name === loggedInUser?.name ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-2 py-1 rounded text-sm ${
                            msg.sender_name === loggedInUser?.name
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-300 text-gray-800'
                          }`}
                        >
                          <p className="break-words">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Mesaj..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget as HTMLInputElement;
                        handleSendMessage(personName, input.value);
                        input.value = '';
                      }
                    }}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector(`input[placeholder="Mesaj..."]`) as HTMLInputElement;
                      if (input) {
                        handleSendMessage(personName, input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
