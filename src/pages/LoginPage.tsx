import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { phoneSchema, type PhoneFormData } from "../schemas/phoneSchema";
import { useAuthStore } from "../stores/authStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import texts from "../config/texts.json";

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    mode: "onChange",
  });

  const { onChange, ...phoneRegister } = register("phone");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = applyPhoneMask(e.target.value);
    setValue("phone", masked, { shouldValidate: true });
  };

  const onSubmit = async (data: PhoneFormData) => {
    await login(data.phone);
    navigate("/booking");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-background)",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--color-foreground)",
              marginBottom: "0.5rem",
            }}
          >
            {texts.login.titulo}
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted-foreground)",
            }}
          >
            {texts.login.subtitulo}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          noValidate
        >
          <Input
            id="phone"
            type="tel"
            placeholder={texts.login.placeholder}
            error={errors.phone?.message}
            onChange={handlePhoneChange}
            {...phoneRegister}
          />

          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            disabled={!isValid || isLoading}
            style={{ width: "100%" }}
          >
            {texts.login.botaoEntrar}
          </Button>
        </form>
      </div>
    </div>
  );
}
