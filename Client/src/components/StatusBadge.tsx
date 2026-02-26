import './StatusBadge.css';

export type OrderStatus = 'ready_for_pickup' | 'pending' | 'completed' | 'cancelled';

interface StatusBadgeProps {
    status: OrderStatus;
}

const statusLabels: Record<OrderStatus, string> = {
    ready_for_pickup: 'Ready for pickup',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const StatusBadge = ({ status }: StatusBadgeProps) => (
    <span className={`status-badge status-badge--${status}`}>
        {statusLabels[status]}
    </span>
);

export default StatusBadge;
