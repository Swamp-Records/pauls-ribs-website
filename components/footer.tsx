import styles from"./footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <p>&copy; {new Date().getFullYear()} Paul's Ribs. All rights reserved.</p>
        </footer>
    )
}