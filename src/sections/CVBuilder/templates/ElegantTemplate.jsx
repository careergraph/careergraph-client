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
    padding: 50,
  },
  header: {
    textAlign: "center",
    borderBottom: "1 solid #e2e8f0",
    paddingBottom: 24,
    marginBottom: 28,
  },
  name: {
    fontSize: 28,
    fontWeight: 300,
    letterSpacing: 4,
    color: "#4f46e5",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  headline: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: 14,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 16,
    fontSize: 9.5,
    color: "#64748b",
    marginTop: 12,
  },
  contactItem: {
    color: "#64748b",
    textDecoration: "none",
  },
  divider: {
    textAlign: "center",
    color: "#cbd5e1",
  },
  summary: {
    textAlign: "center",
    fontSize: 10.5,
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 30,
    fontStyle: "italic",
    paddingHorizontal: 50,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#4f46e5",
    marginBottom: 14,
    textAlign: "center",
    paddingBottom: 8,
    borderBottom: "0.5 solid #e2e8f0",
  },
  experienceItem: {
    marginBottom: 18,
    paddingLeft: 20,
    paddingRight: 20,
  },
  jobHeader: {
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
    fontStyle: "italic",
  },
  company: {
    fontSize: 10.5,
    color: "#4f46e5",
    marginBottom: 6,
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
    gap: 30,
    marginTop: 10,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 12,
    textAlign: "center",
  },
  degree: {
    fontSize: 10,
    fontWeight: 700,
    color: "#111827",
  },
  school: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  skillBadge: {
    fontSize: 9,
    color: "#7C3AED",
    border: "1 solid #e9d5ff",
    borderRadius: 15,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#faf5ff",
  },
  languageItem: {
    textAlign: "center",
    fontSize: 9,
    marginBottom: 6,
    color: "#4b5563",
  },
  awardItem: {
    marginBottom: 10,
    textAlign: "center",
  },
  awardTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#111827",
  },
  awardDetail: {
    fontSize: 8.5,
    color: "#6b7280",
    marginTop: 2,
  },
});

const ElegantTemplate = ({ data }) => {
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
            {contact?.phone && <Text style={styles.contactItem}>{contact.phone}</Text>}
            {contact?.phone && contact?.email && <Text style={styles.divider}>•</Text>}
            {contact?.email && <Text style={styles.contactItem}>{contact.email}</Text>}
            {(contact?.phone || contact?.email) && personal?.location && <Text style={styles.divider}>•</Text>}
            {personal?.location && <Text style={styles.contactItem}>{personal.location}</Text>}
          </View>
        </View>

        {/* Summary */}
        {personal?.summary && <Text style={styles.summary}>"{personal.summary}"</Text>}

        {/* Experience */}
        {safeExperience.length > 0 && (
          <View style={styles.section} wrap>
            <Text style={styles.sectionTitle}>Kinh nghiệm nghề nghiệp</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
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

        {/* Two Columns Section */}
        <View style={styles.twoColumns}>
          {/* Left Column: Education & Awards */}
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

            {safeAwards.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Giải thưởng</Text>
                {safeAwards.map((award, index) => (
                  <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                    <Text style={styles.awardTitle}>{award?.title || ""}</Text>
                    <Text style={styles.awardDetail}>{award?.issuer || ""} - {award?.year || ""}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Right Column: Skills & Languages */}
          <View style={styles.column}>
            {safeSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Kỹ năng</Text>
                <View style={styles.skillsContainer}>
                  {safeSkills.map((skill, index) => (
                    <Text key={skill?.id || `skill-${index}`} style={styles.skillBadge}>
                      {skill?.name || skill}
                    </Text>
                  ))}
                </View>
              </View>
            )}

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
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ElegantTemplate;
