import css from "./LogOut.module.css";

import Button from "../Button/Button";

export default function LogOut() {
    return (
        <div className={css.logOutWrapper}>
            <p className={css.questionText}>Are you sure you want to log out?</p>
            <div className={css.btnWrapper}>
                <Button
                className={css.btnlogOut}
                text="Log Out"
                onClick={() => { }}
                color="green"
            />
            <Button
                className={css.btnCancel}
                text="Cancel"
                onClick={() => { }}
                color="gray"
            />
            </div>
        </div>
    )

}
