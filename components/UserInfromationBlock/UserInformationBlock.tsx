import Image from "next/image";
import css from "./UserInfromationBlock.module.css"

export default function UserInformationBlock() {
    return <div className={css.wrapperInformation}>
        <Image src={"/photosUsers.svg"} alt={"photosUser"} width={125} height={48}/>
        <div className={css.textInformationWrapper}>
            <h2 className={css.title}>1000 users + </h2>
            <p className={css.text}>Trusted by users for reliable expense tracking!</p>
        </div>
    </div>


}