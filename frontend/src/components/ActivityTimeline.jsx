import React from 'react';
import { useWorkflow } from '../context/WorkflowContext';
import { format } from 'date-fns';
import { Clock, CheckCircle, XCircle, AlertCircle, PlayCircle, PlusCircle } from 'lucide-react';
import './ActivityTimeline.css';

const ActivityTimeline = ({ taskId }) => {
  const { taskTimelines } = useWorkflow();
  const timeline = taskTimelines[taskId] || [];

  const getIcon = (type) => {
    switch (type) {
      case 'CREATED': return <PlusCircle size={16} className="tl-icon create" />;
      case 'STATUS_CHANGED': return <PlayCircle size={16} className="tl-icon status" />;
      case 'APPROVAL_REQUESTED': return <AlertCircle size={16} className="tl-icon request" />;
      case 'APPROVAL_GRANTED': return <CheckCircle size={16} className="tl-icon grant" />;
      case 'APPROVAL_REJECTED': return <XCircle size={16} className="tl-icon reject" />;
      default: return <Clock size={16} className="tl-icon default" />;
    }
  };

  return (
    <div className="activity-timeline-container">
      <h3 className="timeline-title">Activity</h3>
      {timeline.length === 0 ? (
        <p className="empty-timeline">No recent activity logged for this session.</p>
      ) : (
        <div className="timeline-list">
          {timeline.map((event, index) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-connector">
                <div className="timeline-node">{getIcon(event.eventType)}</div>
                {index < timeline.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-content">
                <p className="timeline-desc">
                  <span className="timeline-user">{event.user || 'System'}</span> {event.description}
                </p>
                <span className="timeline-time">
                  {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
