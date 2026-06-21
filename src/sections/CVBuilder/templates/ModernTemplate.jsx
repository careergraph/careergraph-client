import { Document, Page, Text, View, Link, StyleSheet, Font, Image } from "@react-pdf/renderer";

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
    padding: 0,
  },
  header: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: 35,
    paddingBottom: 28,
  },
  name: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 6,
  },
  headline: {
    fontSize: 15,
    fontWeight: 300,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    marginTop: 4,
    color: "#eff6ff",
  },
  contactBar: {
    backgroundColor: "#1e3a8a",
    color: "#ffffff",
    padding: 14,
    paddingHorizontal: 35,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    fontSize: 9.5,
  },
  contactItem: {
    color: "#e0e7ff",
    textDecoration: "none",
  },
  content: {
    padding: 35,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#2563eb",
    marginBottom: 14,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    borderBottom: "2 solid #bfdbfe",
    paddingBottom: 6,
  },
  summary: {
    lineHeight: 1.8,
    fontSize: 10.5,
    color: "#475569",
    marginBottom: 4,
  },
  experienceItem: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 3,
  },
  company: {
    fontSize: 10.5,
    color: "#3b82f6",
    fontWeight: 500,
    marginBottom: 3,
  },
  timeline: {
    fontSize: 9.5,
    color: "#64748b",
    marginBottom: 8,
  },
  bulletPoints: {
    paddingLeft: 14,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.7,
    marginBottom: 4,
    color: "#475569",
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 24,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
  },
  school: {
    fontSize: 10,
    color: "#475569",
    marginTop: 3,
  },
  skillsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillPill: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 9.5,
    fontWeight: 500,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    border: "1 solid #bfdbfe",
  },
});

const ModernTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#3b82f6";
  const darkerThemeColor = personal?.themeColor || "#2563eb";

  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const leftColSections = getSortedSections(["education", "languages"]);
  const rightColSections = getSortedSections(["skills", "awards"]);

  const renderSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} wrap key="experience">
            <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Kinh nghiệm làm việc</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{item?.role || ""}</Text>
                <Text style={[styles.company, { color: themeColor }]}>{item?.company || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
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
          <View style={styles.section} key="education">
            <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                <Text style={styles.degree}>{item?.degree || ""}</Text>
                <Text style={styles.school}>{item?.school || ""}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={{ fontSize: 9.5, marginBottom: 4 }}>
                • {lang?.name || ""}
              </Text>
            ))}
          </View>
        ) : null;
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Kỹ năng</Text>
            <View style={styles.skillsGrid}>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={[styles.skillPill, { color: darkerThemeColor, borderColor: themeColor }]}>
                  {skill?.name || skill}
                </Text>
              ))}
            </View>
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: 700, fontSize: 9.5 }}>{award?.title || ""}</Text>
                <Text style={{ fontSize: 9, color: "#6b7280" }}>{award?.issuer || ""}</Text>
                <Text style={{ fontSize: 8.5, color: "#9ca3af" }}>{award?.year || ""}</Text>
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
        <View style={[styles.header, { backgroundColor: themeColor, display: "flex", flexDirection: "row", alignItems: "center", gap: 24 }]}>
          {personal?.avatar && (
            <Image src={personal.avatar} style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", border: "3 solid rgba(255,255,255,0.3)" }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={styles.headline}>{personal?.headline}</Text>
          </View>
        </View>

        {/* Contact Bar */}
        <View style={styles.contactBar}>
          {contact?.email && <Text style={styles.contactItem}>{contact.email}</Text>}
          {contact?.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
          {contact?.website && (
            <Link style={styles.contactItem} src={`https://${contact.website.replace(/^https?:\/\//, "")}`}>
              {contact.website}
            </Link>
          )}
          {personal?.location && <Text style={styles.contactItem}>{personal.location}</Text>}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Summary */}
          {personal?.summary && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: darkerThemeColor, borderBottomColor: themeColor }]}>Giới thiệu</Text>
              <Text style={styles.summary}>{personal.summary}</Text>
            </View>
          )}

          {renderSection("experience")}

          {/* Two Columns: Education & Skills */}
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              {leftColSections.map((key) => renderSection(key))}
            </View>

            <View style={styles.column}>
              {rightColSections.map((key) => renderSection(key))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernTemplate;
