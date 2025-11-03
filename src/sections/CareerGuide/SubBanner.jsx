import Container from "../../components/Containers/Container";
import SearchBar from "~/components/Search/SearchBar";
export default function SubBanner({
  src,
  // breadcrumbs = [
  //   { label: "Trang chủ", href: "/home" },
  //   { label: "Cẩm nang" },
  // ],
}) {
  return (
    <div className="bg-white">
      <Container className="py-4 flex items-center gap-4">
        <p
          className="flex-1 text-3xl md:text-3xl font-semibold drop-shadow bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(to right, #6a5af9, #7b6cf9, #a78bfa)",
          }}
        >
          La bàn sự nghiệp
        </p>
      </Container>

      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50">
          <img
            src={
              src
                ? src
                : "https://vieclam24h.vn/_next/image?url=https%3A%2F%2Fwp-cms-media.s3.ap-east-1.amazonaws.com%2FCAM_NANG_NN_1280x320_3c63494b69.jpg&w=3840&q=75"
            }
          />
        </div>
      </Container>
    </div>
  );
}
