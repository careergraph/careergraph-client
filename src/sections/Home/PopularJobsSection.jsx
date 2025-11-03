import React from "react";

import JobsCardCommon from "../../components/Cards/JobsCardCommon";
import SectionTitle from "../../components/Sections/SectionTitle";
import { JobService } from "../../services/jobService";

export default function PopularJobsSection() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await JobService.fetchPopularJobs({ signal: controller.signal });
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Không thể tải việc làm phổ biến:", error);
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

  const items = jobs.slice(0, 4);

  return (
    <>
      <SectionTitle
        text1="Việc làm phổ biến"
        text2="Tổng quan việc làm phổ biến"
        text3="Những công việc được nhiều ứng viên quan tâm, có thể sẽ hữu ích trong quá trình tìm kiếm việc làm của bạn."
      />

      <div className="flex flex-wrap items-center justify-center gap-8 mt-12">
        {loading && !items.length ? (
          <p className="text-sm text-slate-500">Đang tải danh sách việc làm...</p>
        ) : null}

        {!loading && !items.length ? (
          <p className="text-sm text-slate-500">Hiện chưa có việc làm phổ biến.</p>
        ) : null}

        {items.map((job) => (
          <JobsCardCommon key={job.id} job={job} />
        ))}
      </div>
    </>
  );
}
