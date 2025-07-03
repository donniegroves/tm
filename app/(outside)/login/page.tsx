import HorizontalRule from "@/app/components/HorizontalRule";
import { LoginForm } from "@/app/components/LoginForm";

export default async function Login() {
    return (
        <>
            <h1 className="text-4xl font-bold mb-10">Login</h1>
            <HorizontalRule text="Login with a third-party account" />
            <LoginForm />
        </>
    );
}
