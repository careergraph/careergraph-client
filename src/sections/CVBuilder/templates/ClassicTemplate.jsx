import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      fontWeight: 300,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
      fontWeight: 400,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
      fontWeight: 500,
    },
    {
      src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    padding: 55,
    paddingTop: 50,
  },
  header: {
    borderBottom: "2 solid #0f172a",
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: 1.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 12,
    color: "#475569",
    marginTop: 4,
    marginBottom: 12,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    fontSize: 9.5,
    color: "#64748b",
    marginTop: 8,
  },
  contactItem: {
    color: "#64748b",
    textDecoration: "none",
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "1 solid #cbd5e1",
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 6,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#0f172a",
  },
  timeline: {
    fontSize: 9.5,
    color: "#94a3b8",
  },
  company: {
    fontSize: 10.5,
    color: "#475569",
    marginBottom: 6,
    fontWeight: 500,
  },
  bulletPoints: {
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.7,
    marginBottom: 3,
    color: "#475569",
  },
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
  },
  school: {
    fontSize: 9,
    color: "#4b5563",
    marginTop: 2,
  },
  skillsRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  skill: {
    fontSize: 9,
    color: "#374151",
  },
  divider: {
    color: "#d1d5db",
    marginHorizontal: 2,
  },
  languageItem: {
    fontSize: 9,
    marginBottom: 4,
    color: "#4b5563",
  },
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#111827",
  },
  awardDetail: {
    fontSize: 8.5,
    color: "#6b7280",
    marginTop: 1,
  },
});

const ClassicTemplate = ({ data }) => {
  const {
    personal = {},
    contact = {},
    experience = [],
    education = [],
    skills = [],
    languages = [],
    awards = [],
    layout = {},
  } = data || {};

  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeAwards = Array.isArray(awards) ? awards : [];
  const safeExperience = Array.isArray(experience) ? experience : [];
  const safeEducation = Array.isArray(education) ? education : [];

  const formatTimeline = (start, end) => {
    if (!start && !end) return "";
    if (start && !end) return `${start} - Hiện tại`;
    return `${start || ""} - ${end || ""}`.trim();
  };

  const themeColor = personal?.themeColor || "#0f172a";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const renderSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} wrap key="experience">
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Kinh nghiệm làm việc</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{item?.role || ""}</Text>
                  <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
                <Text style={styles.company}>{item?.company || ""}</Text>
                {Array.isArray(item?.bulletPoints) && item.bulletPoints.length > 0 && (
                  <View style={styles.bulletPoints}>
                    {item.bulletPoints.map((bullet, idx) => (
                      <Text key={`${item?.id || index}-bullet-${idx}`} style={styles.bullet}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null;
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} wrap key="education">
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                <Text style={styles.degree}>{item?.degree || ""}</Text>
                <Text style={styles.school}>{item?.school || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Kỹ năng</Text>
            <View style={styles.skillsRow}>
              {safeSkills.map((skill, index) => (
                <View key={skill?.id || `skill-${index}`} style={{ flexDirection: "row" }}>
                  <Text style={styles.skill}>{skill?.name || skill}</Text>
                  {index < safeSkills.length - 1 && <Text style={styles.divider}>•</Text>}
                </View>
              ))}
            </View>
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={styles.languageItem}>
                {lang?.name || ""}
              </Text>
            ))}
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Giải thưởng & Chứng chỉ</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                <Text style={styles.awardTitle}>{award?.title || ""}</Text>
                <Text style={styles.awardDetail}>{award?.issuer || ""} - {award?.year || ""}</Text>
              </View>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: themeColor }]}>
          <Text style={[styles.name, { color: themeColor }]}>{personal?.fullName}</Text>
          <Text style={styles.headline}>{personal?.headline}</Text>
          <View style={styles.contactRow}>
            {contact?.email && <Text style={styles.contactItem}>{contact.email}</Text>}
            {contact?.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
            {personal?.location && <Text style={styles.contactItem}>{personal.location}</Text>}
            {contact?.website && (
              <Link style={styles.contactItem} src={`https://${contact.website.replace(/^https?:\/\//, "")}`}>
                {contact.website}
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {personal?.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColor, borderBottomColor: themeColor }]}>Tóm tắt</Text>
            <Text style={styles.summary}>{personal.summary}</Text>
          </View>
        )}

        {/* Dynamic Sections */}
        {sectionOrder.map((key) => renderSection(key))}

      </Page>
    </Document>
  );
};

export default ClassicTemplate;
