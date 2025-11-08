import React from "react";

import JobCardPersonal from "../../components/Cards/JobCardPersonal";
import SectionTitle from "../../components/Sections/SectionTitle";
import { JobService } from "../../services/jobService";

export default function PersonalJobsSection() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await JobService.fetchPersonalizedJobs({ signal: controller.signal });
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Không thể tải việc làm cá nhân hoá:", error);
          if (isMounted) {
            setJobs([]);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const items = jobs.slice(0, 6);

  return (
    <>
      <SectionTitle
        text1="Việc làm cá nhân"
        text2="Tổng quan việc làm cá nhân"
        text3="Chúng tôi dựa trên CV và thông tin cá nhân bạn đã cung cấp để đề xuất những công việc phù hợp để bạn ứng tuyển."
      />

      <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
        {loading && !items.length ? (
          <p className="text-sm text-slate-500">Đang tải việc làm cá nhân hoá...</p>
        ) : null}

        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">Bạn chưa có việc làm gợi ý nào.</p>
        ) : null}

        {items.map((job) => (
          <JobCardPersonal key={job.id} job={job} />
        ))}
      </div>
    </>
  );
}
