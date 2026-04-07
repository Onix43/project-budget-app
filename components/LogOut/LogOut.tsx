import css from "./LogOut.module.css";

import { useRouter } from "next/navigation";

import Button from "../Button/Button";
import { useUserStore } from "@/lib/store/useUserStore";
import { logout } from "@/lib/api/clientAuthApi";

interface LogOutProps{
    onClose:() => void
}

export default function LogOut({ onClose }: LogOutProps) {
    
    const router = useRouter()
    const cleanAuth = useUserStore((state) => state.clearIsAuthenticated)
    
    const handleLogOut = async () => {
        try {
            await logout()
        } catch (error) {
            console.error("Logout failed on server:", error);
        } finally {
             cleanAuth();
        onClose();
        router.push('/')
        }
       
    }

    return (
        <div className={css.logOutWrapper}>
            <p className={css.questionText}>Are you sure you want to log out?</p>
            <div className={css.btnWrapper}>
                <Button
                className={css.btnlogOut}
                text="Log Out"
                onClick={handleLogOut}
                color="green"
            />
            <Button
                className={css.btnCancel}
                text="Cancel"
                onClick={onClose}
                color="gray"
            />
            </div>
        </div>
    )

}
