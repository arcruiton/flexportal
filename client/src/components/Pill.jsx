import { variantFor } from '../statusStyles.js';

export default function Pill({ domain, status }) {
  return <span className={`pill ${variantFor(domain, status)}`}>{status}</span>;
}
