import Admin from "./Admin";

/**
 * Admin Protected Page
 * Direkt olarak Admin PIN giriş ekranına yönlendir
 * Master şifre kontrolü kaldırıldı
 * PIN doğrulaması Supabase'deki authorized_persons tablosundan yapılır
 */
export default function AdminProtected() {
  return <Admin />;
}
