import styles from './BottomTab.module.css';

export type TabId = 'lab' | 'myshape' | 'notes';

interface BottomTabProps {
  active: TabId;
  onChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'lab', label: '実験室', icon: '🔬' },
  { id: 'myshape', label: '自分のかたち', icon: '🪞' },
  { id: 'notes', label: 'きろく', icon: '📓' },
];

export function BottomTab({ active, onChange }: BottomTabProps) {
  return (
    <nav className={styles.tabBar}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          <span className={styles.icon}>{tab.icon}</span>
          <span className={styles.label}>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
