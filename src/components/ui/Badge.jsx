import { STATUS_STYLES } from '../../constants';
import { prettyStatus } from '../../utils/format';

export default function Badge({ status }) {
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[status] || ''}`}>
      {prettyStatus(status)}
    </span>
  );
}
