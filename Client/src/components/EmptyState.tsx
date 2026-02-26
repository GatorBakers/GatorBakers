import './EmptyState.css';

interface EmptyStateProps {
    title: string;
    subtitle: string;
    className?: string;
}

const EmptyState = ({ title, subtitle, className = '' }: EmptyStateProps) => (
    <div className={`empty-state ${className}`.trim()}>
        <p className="empty-state-title">{title}</p>
        <p className="empty-state-sub">{subtitle}</p>
    </div>
);

export default EmptyState;
