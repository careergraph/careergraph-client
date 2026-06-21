import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0f172a",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#f8fafc",
    padding: 40,
  },
  header: {
    borderBottom: "2 solid #38bdf8",
    paddingBottom: 20,
    marginBottom: 24,
  },
  name: {
    fontSize: 34,
    fontWeight: 700,
    color: "#f8fafc",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  headline: {
    fontSize: 14,
    color: "#38bdf8",
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  contactRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    fontSize: 10,
    color: "#cbd5e1",
  },
  summary: {
    fontSize: 11,
    lineHeight: 1.8,
    color: "#e2e8f0",
    marginBottom: 30,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#38bdf8",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 16,
  },
  experienceItem: {
    marginBottom: 20,
  },
  jobHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#f8fafc",
  },
  timeline: {
    fontSize: 10,
    color: "#94a3b8",
  },
  company: {
    fontSize: 11,
    color: "#38bdf8",
    fontWeight: 500,
    marginBottom: 8,
  },
  bulletPoints: {
    paddingLeft: 12,
  },
  bullet: {
    fontSize: 10.5,
    lineHeight: 1.7,
    color: "#cbd5e1",
    marginBottom: 4,
  },
  twoColumns: {
    display: "flex",
    flexDirection: "row",
    gap: 40,
  },
  column: {
    flex: 1,
  },
  educationItem: {
    marginBottom: 14,
  },
  degree: {
    fontSize: 11.5,
    fontWeight: 700,
    color: "#f8fafc",
    marginBottom: 4,
  },
  school: {
    fontSize: 10.5,
    color: "#cbd5e1",
    marginBottom: 2,
  },
  skillRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  skillBadge: {
    fontSize: 10,
    color: "#0f172a",
    backgroundColor: "#38bdf8",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  awardItem: {
    marginBottom: 10,
  },
  awardTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: "#f8fafc",
  },
  awardDetail: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 1,
  },
});

const DarkTemplate = ({ data }) => {
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

  const themeColor = personal?.themeColor || "#38bdf8";
  const sectionOrder = layout?.sectionOrder || ["experience", "education", "skills", "languages", "awards"];

  const getSortedSections = (keys) => {
    return keys.sort((a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b));
  };

  const mainSections = getSortedSections(["experience"]);
  const leftColSections = getSortedSections(["education", "languages"]);
  const rightColSections = getSortedSections(["skills", "awards"]);

  const renderMainSection = (key) => {
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
      default:
        return null;
    }
  };

  const renderLeftSection = (key) => {
    switch (key) {
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
      case "languages":
        return safeLanguages.length > 0 ? (
          <View style={styles.section} key="languages">
            <Text style={[styles.sectionTitle, { color: themeColor }]}>Ngôn ngữ</Text>
            <View style={styles.skillRow}>
              {safeLanguages.map((lang, index) => (
                 <Text key={lang?.id || `lang-${index}`} style={[styles.skillBadge, { backgroundColor: themeColor }]}>{lang?.name || ""}</Text>
              ))}
            </View>
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
            <View style={styles.skillRow}>
              {safeSkills.map((skill, index) => (
                 <Text key={skill?.id || `skill-${index}`} style={[styles.skillBadge, { backgroundColor: themeColor }]}>{skill?.name || skill}</Text>
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
        <View style={[styles.header, { borderBottomColor: themeColor, display: "flex", flexDirection: "row", alignItems: "center", gap: 24 }]}>
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

        {personal?.summary && (
          <Text style={styles.summary}>{personal.summary}</Text>
        )}

        {mainSections.map((key) => renderMainSection(key))}

        <View style={styles.twoColumns}>
          <View style={styles.column}>
            {leftColSections.map((key) => renderLeftSection(key))}
          </View>

          <View style={styles.column}>
            {rightColSections.map((key) => renderRightSection(key))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default DarkTemplate;
