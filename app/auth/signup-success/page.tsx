import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Vérifiez votre email</h1>
            <p className="text-muted-foreground">
              Un lien de confirmation a été envoyé à votre adresse email. Vérifiez votre boîte de réception et suivez
              les instructions pour activer votre compte.
            </p>
          </div>
          <Link href="/auth/login">
            <Button className="w-full">Retour à la connexion</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
