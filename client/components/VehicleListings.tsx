import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { getShowcaseAdminPin } from "@/lib/showcase-admin";
import { supabase } from "@/lib/supabase";

type Listing = {
  key: string;
  listing_number: string;
  vehicle: string;
  image_url: string;
};

const defaults: Listing[] = [
  ["1339223539", "2011 Volkswagen Touareg"],
  ["1345559403", "2011 BMW X5"],
  ["1350947810", "2021 Fiat Egea"],
  ["1350995573", "2015 Volkswagen Polo"],
  ["1351066847", "2016 Peugeot 3008"],
].map(([number, vehicle]) => ({
  key: "00000000-0000-4000-8000-" + number.padStart(12, "0"),
  listing_number: number,
  vehicle,
  image_url: "/assets/vehicle-listings/" + number + ".jpg",
}));

const iconButton =
  "grid size-11 shrink-0 place-items-center rounded-full bg-blue-950/90 text-white hover:bg-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
const field = "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2";

function ListingEditor({
  listing,
  onSave,
  restoreFocus,
}: {
  listing: Listing | null;
  onSave: (listing: Listing) => void;
  restoreFocus: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const adminPin = getShowcaseAdminPin();
    if (!adminPin || busy) return;

    const form = new FormData(event.currentTarget);
    const listingNumber = String(form.get("number")).trim();
    const vehicle = String(form.get("vehicle")).trim();
    const file = form.get("image") as File;
    if (!/^[0-9]{1,20}$/.test(listingNumber) || !vehicle) {
      setError("Araç adını ve rakamlardan oluşan ilan numarasını girin.");
      return;
    }
    if (
      file.size &&
      (!["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 2_000_000)
    ) {
      setError("En fazla 2 MB boyutunda bir JPG, PNG veya WebP seçin.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const image = file.size
        ? await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          })
        : listing?.image_url;
      if (!image) {
        setError("Bir araç görseli seçin.");
        return;
      }

      const next = {
        key: listing?.key ?? crypto.randomUUID(),
        listing_number: listingNumber,
        vehicle,
        image_url: image,
      };
      const { error: saveError } = await supabase.rpc("save_showcase_vehicle", {
        admin_pin: adminPin,
        vehicle_key: next.key,
        number_value: next.listing_number,
        vehicle_name: next.vehicle,
        image_value: next.image_url,
      });
      if (saveError?.code === "PGRST202") {
        setError("Vitrin kayıt altyapısı henüz veritabanında etkin değil.");
        return;
      }
      if (saveError) throw saveError;
      onSave(next);
    } catch {
      setError("Araç kaydedilemedi. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DialogContent
      className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto rounded-2xl"
      onCloseAutoFocus={(event) => {
        event.preventDefault();
        restoreFocus();
      }}
    >
      <DialogTitle>{listing ? "İlanı düzenle" : "Araç ekle"}</DialogTitle>
      <DialogDescription>
        Araç bilgilerini ve Sahibinden ilan numarasını girin.
      </DialogDescription>
      <form onSubmit={save} className="grid gap-4 text-sm">
        <label>
          Araç adı
          <input
            className={field}
            name="vehicle"
            defaultValue={listing?.vehicle}
            maxLength={120}
            required
          />
        </label>
        <label>
          İlan numarası
          <input
            className={field}
            name="number"
            inputMode="numeric"
            pattern="[0-9]{1,20}"
            defaultValue={listing?.listing_number}
            required
          />
        </label>
        <label>
          {listing ? "Yeni görsel (isteğe bağlı)" : "Araç görseli"}
          <input
            className={field}
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required={!listing}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="min-h-11 rounded-xl bg-primary px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </form>
    </DialogContent>
  );
}

export default function VehicleListings() {
  const canEdit = Boolean(getShowcaseAdminPin());
  const [saved, setSaved] = useState<Listing[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [editor, setEditor] = useState<{ listing: Listing | null } | null>(
    null,
  );
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const defaultsByKey = new Map(
    defaults.map((listing) => [listing.key, listing]),
  );
  const savedByKey = new Map(saved.map((listing) => [listing.key, listing]));
  const listings = [
    ...defaults.map((listing) => savedByKey.get(listing.key) ?? listing),
    ...saved.filter((listing) => !defaultsByKey.has(listing.key)),
  ];
  const active = activeIndex === null ? null : listings[activeIndex];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("vehicle_showcase")
        .select("key, listing_number, vehicle, image_url")
        .order("created_at");
      if (!cancelled && data) {
        setSaved((current) => [
          ...data.filter(
            (listing) => !current.some(({ key }) => key === listing.key),
          ),
          ...current,
        ]);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  function step(direction: number) {
    setActiveIndex((index) =>
      index === null
        ? null
        : (index + direction + listings.length) % listings.length,
    );
  }

  return (
    <section aria-labelledby="vehicle-listings-title" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2
          id="vehicle-listings-title"
          className="text-left text-2xl font-bold tracking-tight text-primary sm:text-3xl"
        >
          Satışa Açık Vitrin
        </h2>
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {canEdit && (
            <li>
              <button
                type="button"
                aria-label="Araç ekle"
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setEditor({ listing: null });
                }}
                className="grid aspect-[960/1198] w-full place-items-center rounded-xl border-2 border-dashed border-slate-300 text-primary hover:bg-slate-50"
              >
                <Plus size={36} aria-hidden="true" />
              </button>
            </li>
          )}
          {listings.map((listing, index) => (
            <li key={listing.key} className="relative">
              <button
                type="button"
                aria-label={listing.vehicle + " görselini aç"}
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setActiveIndex(index);
                }}
                className="block w-full overflow-hidden rounded-xl border border-slate-200 transition hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <img
                  src={listing.image_url}
                  alt={listing.vehicle}
                  width={960}
                  height={1198}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[960/1198] w-full object-contain"
                />
              </button>
              {canEdit && (
                <button
                  type="button"
                  aria-label={listing.vehicle + " ilanını düzenle"}
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setEditor({ listing });
                  }}
                  className={iconButton + " absolute right-2 top-2"}
                >
                  <Pencil size={17} aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <Dialog
        open={Boolean(active)}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="bg-blue-950/75 backdrop-blur-md motion-reduce:animate-none" />
          <DialogPrimitive.Content
            className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-3 outline-none"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              opener.current?.focus();
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                step(-1);
              }
              if (event.key === "ArrowRight") {
                event.preventDefault();
                step(1);
              }
            }}
          >
            {active && (
              <div className="pointer-events-auto relative flex w-fit max-w-full flex-col items-center gap-3 rounded-2xl bg-blue-950 p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none">
                <DialogTitle className="sr-only">{active.vehicle}</DialogTitle>
                <DialogDescription className="sr-only">
                  {(activeIndex ?? 0) + 1} / {listings.length}
                </DialogDescription>
                <DialogClose
                  aria-label="Görseli kapat"
                  className={iconButton + " absolute right-3 top-3 z-10"}
                >
                  <X size={21} />
                </DialogClose>
                <div
                  className="relative touch-pan-y"
                  onTouchStart={(event) => {
                    const touch = event.touches[0];
                    touchStart.current = { x: touch.clientX, y: touch.clientY };
                  }}
                  onTouchCancel={() => {
                    touchStart.current = null;
                  }}
                  onTouchEnd={(event) => {
                    const start = touchStart.current;
                    touchStart.current = null;
                    if (!start) return;
                    const touch = event.changedTouches[0];
                    const dx = touch.clientX - start.x;
                    const dy = touch.clientY - start.y;
                    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
                      step(dx < 0 ? 1 : -1);
                  }}
                >
                  <img
                    key={active.key}
                    src={active.image_url}
                    alt={active.vehicle}
                    className="max-h-[calc(100dvh-7rem)] max-w-full rounded-xl object-contain animate-in fade-in duration-200 motion-reduce:animate-none"
                  />
                  <button
                    type="button"
                    aria-label="Önceki araç"
                    onClick={() => step(-1)}
                    className={
                      iconButton + " absolute left-2 top-1/2 -translate-y-1/2"
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label="Sonraki araç"
                    onClick={() => step(1)}
                    className={
                      iconButton + " absolute right-2 top-1/2 -translate-y-1/2"
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
                <a
                  href={
                    "https://www.sahibinden.com/kelime-ile-arama?query_text=" +
                    active.listing_number
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-1 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#ffe000] px-4 text-sm font-bold text-black hover:bg-[#ffea52]"
                >
                  Sahibinden.com’da göster{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>

      <Dialog
        open={Boolean(editor)}
        onOpenChange={(open) => {
          if (!open) setEditor(null);
        }}
      >
        {editor && canEdit && (
          <ListingEditor
            listing={editor.listing}
            restoreFocus={() => opener.current?.focus()}
            onSave={(listing) => {
              setSaved((current) =>
                current.some(({ key }) => key === listing.key)
                  ? current.map((item) =>
                      item.key === listing.key ? listing : item,
                    )
                  : [...current, listing],
              );
              setEditor(null);
            }}
          />
        )}
      </Dialog>
    </section>
  );
}
