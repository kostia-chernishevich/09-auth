import css from "./Loader.module.css";

export function Loader() {
    return (
        <div className={css.loaderWrapper}>
            <div className={css.spinner}></div>
            <p>Loading notes...</p>
        </div>
    );
}