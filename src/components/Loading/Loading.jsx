import styles from './Loading.module.css';

function Loading({ size="100px", borderWidth = "5px" }) {
    return (
        <div
            className={styles.loading}
            style={{
                width: size,
                height: size,
                borderWidth: borderWidth
            }}
        ></div>
    );
}

export default Loading;