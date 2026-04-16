export function JobDivider({ jobTitle = null, date = "" }) {
  return (
    <div className="job-divider">
      <span className="jd-line" />
      <span className="jd-label">
        {jobTitle || "Tin nhắn chung"}
        {date ? ` • ${date}` : ""}
      </span>
      <span className="jd-line" />
    </div>
  );
}

export default JobDivider;
