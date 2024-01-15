import { ChangeEvent } from "react";

const Toggle = ({ value, onChange }: { value: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <label className="toggle">
            <input
                className="toggle-checkbox"
                type="checkbox"
                checked={value}
                onChange={onChange}
            />
            <div className={`toggle-switch h-[24px] w-[48px] `}></div>
        </label>
    );
};

export default Toggle;