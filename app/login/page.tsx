import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#060b13] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Dekorační čáry na pozadí - OPRAVENO h-px a w-px */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>

      {/* Samotný komponent přihlášení */}
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>

    </main>
  );
}