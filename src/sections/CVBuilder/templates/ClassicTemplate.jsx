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
    padding: 50,
    paddingTop: 45,
  },
  header: {
    borderBottom: "2 solid #111827",
    paddingBottom: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    letterSpacing: 1,
    marginBottom: 4,
  },
  headline: {
    fontSize: 10.5,
    color: "#4b5563",
    marginTop: 4,
    marginBottom: 10,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    fontSize: 9,
    color: "#4b5563",
    marginTop: 8,
  },
  contactItem: {
    color: "#4b5563",
    textDecoration: "none",
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
    paddingBottom: 4,
    borderBottom: "1 solid #d1d5db",
  },
  summary: {
    fontSize: 9.5,
    lineHeight: 1.7,
    color: "#374151",
    marginBottom: 4,
  },
  experienceItem: {
    marginBottom: 13,
  },
  experienceHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#111827",
  },
  timeline: {
    fontSize: 9,
    color: "#6b7280",
  },
  company: {
    fontSize: 9.5,
    color: "#4b5563",
    marginBottom: 5,
    fontWeight: 500,
  },
  bulletPoints: {
    paddingLeft: 14,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.6,
    marginBottom: 2,
    color: "#4b5563",
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
            <Text style={styles.sectionTitle}>Tóm tắt</Text>
            <Text style={styles.summary}>{personal.summary}</Text>
          </View>
        )}

        {/* Experience */}
        {safeExperience.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
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
        )}

        {/* Education */}
        {safeEducation.length > 0 && (
          <View style={styles.section} wrap>
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

        {/* Skills */}
        {safeSkills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kỹ năng</Text>
            <View style={styles.skillsRow}>
              {safeSkills.map((skill, index) => (
                <View key={skill?.id || `skill-${index}`} style={{ flexDirection: "row" }}>
                  <Text style={styles.skill}>{skill?.name || skill}</Text>
                  {index < safeSkills.length - 1 && <Text style={styles.divider}>•</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {safeLanguages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
            {safeLanguages.map((lang, index) => (
              <Text key={lang?.id || `lang-${index}`} style={styles.languageItem}>
                {lang?.name || ""}
              </Text>
            ))}
          </View>
        )}

        {/* Awards */}
        {safeAwards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giải thưởng & Chứng chỉ</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                <Text style={styles.awardTitle}>{award?.title || ""}</Text>
                <Text style={styles.awardDetail}>{award?.issuer || ""} - {award?.year || ""}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ClassicTemplate;
