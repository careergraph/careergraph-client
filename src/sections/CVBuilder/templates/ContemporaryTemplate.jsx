import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f8fafc",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 40,
    borderBottom: "4 solid #6366f1",
  },
  name: {
    fontSize: 32,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headline: {
    fontSize: 14,
    color: "#6366f1",
    fontWeight: 500,
    marginBottom: 16,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    fontSize: 9.5,
    color: "#64748b",
  },
  content: {
    padding: 40,
    display: "flex",
    flexDirection: "row",
    gap: 32,
  },
  mainColumn: {
    width: "60%",
  },
  sideColumn: {
    width: "40%",
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  summary: {
    fontSize: 10.5,
    lineHeight: 1.8,
    color: "#475569",
    marginBottom: 24,
  },
  experienceItem: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  company: {
    fontSize: 10.5,
    color: "#6366f1",
    fontWeight: 500,
    marginBottom: 6,
  },
  timeline: {
    fontSize: 9.5,
    color: "#94a3b8",
    marginBottom: 10,
  },
  bulletPoints: {
    paddingLeft: 16,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.7,
    color: "#475569",
    marginBottom: 4,
  },
  skillBadge: {
    backgroundColor: "#e0e7ff",
    color: "#4f46e5",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 9.5,
    marginBottom: 8,
    marginRight: 8,
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  educationItem: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
  },
  degree: {
    fontSize: 11,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4,
  },
  school: {
    fontSize: 10,
    color: "#475569",
    marginBottom: 4,
  },
  awardItem: {
    marginBottom: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 3,
  },
  awardDetail: {
    fontSize: 9,
    color: "#64748b",
  },
});

const ContemporaryTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#6366f1";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const mainSections = getSortedSections(["experience", "education"]);
  const sideSections = getSortedSections(["skills", "languages", "awards"]);

  const renderMainSection = (key) => {
    switch (key) {
      case "experience":
        return safeExperience.length > 0 ? (
          <View style={styles.section} key="experience" wrap>
            <Text style={styles.sectionTitle}>Kinh nghiệm</Text>
            {safeExperience.map((item, index) => (
              <View key={item?.id || `exp-${index}`} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{item?.role}</Text>
                <Text style={[styles.company, { color: themeColor }]}>{item?.company}</Text>
                <Text style={styles.timeline}>{formatTimeline(item?.startDate, item?.endDate)}</Text>
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
            <Text style={styles.sectionTitle}>Học vấn</Text>
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

  const renderSideSection = (key) => {
    switch (key) {
      case "skills":
        return safeSkills.length > 0 ? (
          <View style={styles.section} key="skills">
            <Text style={styles.sectionTitle}>Kỹ năng</Text>
            <View style={styles.skillsContainer}>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}15` }]}>{skill?.name || skill}</Text>
              ))}
            </View>
          </View>
        ) : null;
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={styles.sectionTitle}>Ngôn ngữ</Text>
            <View style={styles.skillsContainer}>
              {safeLanguages.map((lang, index) => (
                <Text key={lang?.id || `lang-${index}`} style={[styles.skillBadge, { color: themeColor, backgroundColor: `${themeColor}15` }]}>{lang?.name || ""}</Text>
              ))}
            </View>
          </View>
        ) : null;
      case "awards":
        return safeAwards.length > 0 ? (
          <View style={styles.section} key="awards">
            <Text style={styles.sectionTitle}>Giải thưởng</Text>
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
        <View style={[styles.header, { borderBottom: `4 solid ${themeColor}`, display: "flex", flexDirection: "row", alignItems: "center", gap: 24 }]}>
          {personal?.avatar && (
            <Image src={personal.avatar} style={{ width: 80, height: 80, borderRadius: 40, objectFit: "cover", border: `2 solid ${themeColor}` }} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={[styles.headline, { color: themeColor }]}>{personal?.headline}</Text>
            <View style={styles.contactRow}>
              {contact?.phone && <Text>{contact.phone}</Text>}
              {contact?.email && <Text>{contact.email}</Text>}
              {personal?.location && <Text>{personal.location}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainColumn}>
            {personal?.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tóm tắt</Text>
                <Text style={styles.summary}>{personal.summary}</Text>
              </View>
            )}

            {mainSections.map((key) => renderMainSection(key))}
          </View>

          <View style={styles.sideColumn}>
            {sideSections.map((key) => renderSideSection(key))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ContemporaryTemplate;
