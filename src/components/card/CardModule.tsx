import styles from './CardModule.module.css';

interface BrutalistButtonProps {
  onClick: () => void;
  logo: React.ReactNode;
  topText: string;
  bottomText: string;
}

const CardModule: React.FC<BrutalistButtonProps> = ({ onClick, logo, topText, bottomText }) => {
  return (
    <div className={styles.buttonContainer}>
      <button className={`${styles.brutalistButton} ${styles.button2}`} onClick={onClick}>
        <div className={styles.openaiLogo}>
          {logo}
        </div>
        <div className={styles.buttonText}>
          <span>{topText}</span>
          <span>{bottomText}</span>
        </div>
      </button>
    </div>
  );
};

export default CardModule;
