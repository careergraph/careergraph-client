import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    padding: 40,
  },
  header: {
    backgroundColor: "#059669",
    color: "#ffffff",
    padding: 30,
    marginBottom: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 8,
    color: "#ffffff",
  },
  headline: {
    fontSize: 12,
    fontWeight: 400,
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#d1fae5",
    marginBottom: 12,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    fontSize: 9.5,
    color: "#ecfdf5",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#059669",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
    borderBottom: "1 solid #e5e7eb",
    paddingBottom: 6,
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 20,
  },
  columns: {
    display: "flex",
    flexDirection: "row",
    gap: 24,
  },
  leftColumn: {
    width: "65%",
  },
  rightColumn: {
    width: "35%",
  },
  experienceItem: {
    marginBottom: 16,
  },
  jobHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
  },
  timeline: {
    fontSize: 9.5,
    color: "#64748b",
  },
  company: {
    fontSize: 10,
    color: "#059669",
    marginBottom: 6,
    fontWeight: 500,
  },
  bulletPoints: {
    paddingLeft: 12,
  },
  bullet: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: "#475569",
    marginBottom: 3,
  },
  skillBadge: {
    backgroundColor: "#ecfdf5",
    color: "#047857",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 9.5,
    marginBottom: 6,
    marginRight: 6,
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  educationItem: {
    marginBottom: 12,
  },
  degree: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#0f172a",
  },
  school: {
    fontSize: 9.5,
    color: "#475569",
    marginTop: 2,
  },
  awardItem: {
    marginBottom: 8,
  },
  awardTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#0f172a",
  },
  awardDetail: {
    fontSize: 8.5,
    color: "#64748b",
    marginTop: 1,
  },
});

const TechTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#059669";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const leftColSections = getSortedSections(["experience", "education"]);
  const rightColSections = getSortedSections(["skills", "languages", "awards"]);

  const renderLeftSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} key="experience" wrap>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kinh nghiệm</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{item?.role}</Text>
                  <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                </View>
                <Text style={[styles.company, { color: themeColor }]}>{item?.company}</Text>
                {item?.bulletPoints && item.bulletPoints.length > 0 && (
                  <View style={styles.bulletPoints}>
                    {item.bulletPoints.map((bullet, idx) => (
                      <Text key={`${item?.id || index}-bullet-${idx}`} style={styles.bullet}>• {bullet}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null;
      case "education":
        return safeEducation.length > 0 ? (
          <View style={styles.section} key="education" wrap>
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Học vấn</Text>
            {safeEducation.map((item, index) => (
              <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                <Text style={styles.degree}>{item?.degree}</Text>
                <Text style={styles.school}>{item?.school}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
              </View>
            ))}
          </View>
        ) : null;
      default:
        return null;
    }
  };

  const renderRightSection = (key) => {
    switch (key) {
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Kỹ năng</Text>
            <View style={styles.skillsContainer}>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={[styles.skillBadge, { color: themeColor, border: `1 solid ${themeColor}40`, backgroundColor: "transparent" }]}>{skill?.name || skill}</Text>
              ))}
            </View>
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Ngôn ngữ</Text>
            <View style={styles.skillsContainer}>
              {safeLanguages.map((lang, index) => (
                <Text key={lang?.id || `lang-${index}`} style={[styles.skillBadge, { color: themeColor, border: `1 solid ${themeColor}40`, backgroundColor: "transparent" }]}>{lang?.name || ""}</Text>
              ))}
            </View>
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Giải thưởng</Text>
            {safeAwards.map((award, index) => (
              <View key={award?.id || `award-${index}`} style={styles.awardItem}>
                <Text style={styles.awardTitle}>{award?.title}</Text>
                <Text style={styles.awardDetail}>{award?.issuer} • {award?.year}</Text>
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
        <View style={[styles.header, { backgroundColor: themeColor, display: "flex", flexDirection: "row", alignItems: "center", gap: 20 }]}>
          {personal?.avatar && (
            <Image src={personal.avatar} style={{ width: 70, height: 70, borderRadius: 8, objectFit: "cover", border: "2 solid rgba(255,255,255,0.4)" }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={styles.headline}>{personal?.headline}</Text>
            <View style={styles.contactRow}>
              {contact?.phone && <Text>{contact.phone}</Text>}
              {contact?.email && <Text>{contact.email}</Text>}
              {personal?.location && <Text>{personal.location}</Text>}
            </View>
          </View>
        </View>

        {personal?.summary && <Text style={styles.summary}>{personal.summary}</Text>}

        <View style={styles.columns}>
          <View style={styles.leftColumn}>
            {leftColSections.map((key) => renderLeftSection(key))}
          </View>

          <View style={styles.rightColumn}>
            {rightColSections.map((key) => renderRightSection(key))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TechTemplate;
