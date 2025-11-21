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
    color: "#1f2937",
    padding: 0,
  },
  header: {
    backgroundColor: "#2563EB",
    color: "#ffffff",
    padding: 30,
    paddingBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headline: {
    fontSize: 14,
    fontWeight: 300,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
  },
  contactBar: {
    backgroundColor: "#1e40af",
    color: "#ffffff",
    padding: 12,
    paddingHorizontal: 30,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    fontSize: 9,
  },
  contactItem: {
    color: "#ffffff",
    textDecoration: "none",
  },
  content: {
    padding: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2563EB",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    borderBottom: "2 solid #2563EB",
    paddingBottom: 4,
  },
  summary: {
    lineHeight: 1.7,
    fontSize: 10,
    color: "#374151",
    marginBottom: 4,
  },
  experienceItem: {
    marginBottom: 14,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: "#2563EB",
    fontWeight: 500,
    marginBottom: 2,
  },
  timeline: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 6,
  },
  bulletPoints: {
    paddingLeft: 12,
  },
  bullet: {
    fontSize: 9.5,
    lineHeight: 1.6,
    marginBottom: 3,
    color: "#374151",
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
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
    fontSize: 9.5,
    color: "#4b5563",
    marginTop: 2,
  },
  skillsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontSize: 9,
    fontWeight: 500,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal?.fullName}</Text>
          <Text style={styles.headline}>{personal?.headline}</Text>
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
              <Text style={styles.sectionTitle}>Giới thiệu</Text>
              <Text style={styles.summary}>{personal.summary}</Text>
            </View>
          )}

          {/* Experience */}
          {safeExperience.length > 0 && (
            <View style={styles.section} wrap>
              <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
              {safeExperience.map((item, index) => (
                <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{item?.role || ""}</Text>
                  <Text style={styles.company}>{item?.company || ""}</Text>
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
          )}

          {/* Two Columns: Education & Skills */}
          <View style={styles.twoColumns}>
            {/* Education */}
            <View style={styles.column}>
              {safeEducation.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Học vấn</Text>
                  {safeEducation.map((item, index) => (
                    <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                      <Text style={styles.degree}>{item?.degree || ""}</Text>
                      <Text style={styles.school}>{item?.school || ""}</Text>
                      <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Languages */}
              {safeLanguages.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
                  {safeLanguages.map((lang, index) => (
                    <Text key={lang?.id || `lang-${index}`} style={{ fontSize: 9.5, marginBottom: 4 }}>
                      • {lang?.name || ""}
                    </Text>
                  ))}
                </View>
              )}
            </View>

            {/* Skills */}
            <View style={styles.column}>
              {safeSkills.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Kỹ năng</Text>
                  <View style={styles.skillsGrid}>
                    {safeSkills.map((skill, index) => (
                      <Text key={skill?.id || `skill-${index}`} style={styles.skillPill}>
                        {skill?.name || skill}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Awards */}
              {safeAwards.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Giải thưởng</Text>
                  {safeAwards.map((award, index) => (
                    <View key={award?.id || `award-${index}`} style={{ marginBottom: 8 }}>
                      <Text style={{ fontWeight: 700, fontSize: 9.5 }}>{award?.title || ""}</Text>
                      <Text style={{ fontSize: 9, color: "#6b7280" }}>{award?.issuer || ""}</Text>
                      <Text style={{ fontSize: 8.5, color: "#9ca3af" }}>{award?.year || ""}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernTemplate;
