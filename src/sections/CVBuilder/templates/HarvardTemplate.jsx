import { Document, Page, Text, View, Link, StyleSheet, Font } from "@react-pdf/renderer";

// Register Vietnamese-compatible font
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
    flexDirection: "row",
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#1f2937",
  },
  sidebar: {
    width: "35%",
    backgroundColor: "#2c1a1d",
    color: "#f8fafc",
    padding: 24,
    display: "flex",
    gap: 16,
  },
  sidebarHeading: {
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
    color: "#e9d8d8",
    fontWeight: 700,
  },
  sidebarLink: {
    color: "#f8fafc",
    textDecoration: "none",
    marginBottom: 5,
    fontSize: 9,
  },
  sidebarText: {
    marginBottom: 5,
    lineHeight: 1.5,
    fontSize: 9,
  },
  languageItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontSize: 9,
  },
  main: {
    width: "65%",
    padding: 32,
    display: "flex",
    gap: 20,
  },
  header: {
    borderBottom: "2 solid #a51c30",
    paddingBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#111827",
  },
  headline: {
    fontSize: 12,
    color: "#a51c30",
    marginTop: 6,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: 500,
  },
  summary: {
    marginTop: 10,
    lineHeight: 1.6,
    fontSize: 9.5,
    color: "#374151",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: 700,
    color: "#a51c30",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  experienceItem: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 8,
  },
  experienceHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontWeight: 700,
    fontSize: 10.5,
    color: "#111827",
  },
  companyLine: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#4b5563",
  },
  bulletList: {
    marginTop: 4,
    paddingLeft: 10,
    lineHeight: 1.5,
    fontSize: 9,
  },
  educationItem: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
    marginBottom: 6,
  },
  tag: {
    fontSize: 8,
    border: "1 solid #a51c30",
    color: "#a51c30",
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
});

const HarvardTemplate = ({ data }) => {
  const {
    personal = {},
    contact = {},
    experience = [],
    education = [],
    skills = [],
    languages = [],
    awards = [],
  } = data || {};

  // Ensure arrays are valid
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
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.sidebar}>
          <View>
            <Text style={styles.sidebarHeading}>Liên hệ</Text>
            {contact?.phone ? (
              <Text style={styles.sidebarText}>{contact.phone}</Text>
            ) : null}
            {contact?.email ? (
              <Link style={styles.sidebarLink} src={`mailto:${contact.email}`}>
                {contact.email}
              </Link>
            ) : null}
            {contact?.website ? (
              <Link
                style={styles.sidebarLink}
                src={`https://${contact.website.replace(/^https?:\/\//, "")}`}
              >
                {contact.website}
              </Link>
            ) : null}
            {contact?.linkedin ? (
              <Link
                style={styles.sidebarLink}
                src={`https://${contact.linkedin.replace(/^https?:\/\//, "")}`}
              >
                {contact.linkedin}
              </Link>
            ) : null}
          </View>

          {safeSkills.length ? (
            <View>
              <Text style={styles.sidebarHeading}>Kỹ năng nổi bật</Text>
              {safeSkills.map((skill, index) => (
                <Text key={skill?.id || `skill-${index}`} style={styles.sidebarText}>
                  • {skill?.name || skill}
                </Text>
              ))}
            </View>
          ) : null}

          {safeLanguages.length ? (
            <View>
              <Text style={styles.sidebarHeading}>Ngôn ngữ</Text>
              {safeLanguages.map((lang, index) => (
                <Text key={lang?.id || `lang-${index}`} style={styles.sidebarText}>
                  • {lang?.name || ""}
                </Text>
              ))}
            </View>
          ) : null}

          {safeAwards.length ? (
            <View>
              <Text style={styles.sidebarHeading}>Giải thưởng</Text>
              {safeAwards.map((award, index) => (
                <View key={award?.id || `award-${index}`} style={{ marginBottom: 6 }}>
                  <Text style={{ fontWeight: 700 }}>{award?.title || ""}</Text>
                  <Text style={{ fontSize: 10 }}>{award?.issuer || ""}</Text>
                  <Text style={{ fontSize: 10 }}>{award?.year || ""}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.name}>{personal?.fullName}</Text>
            <Text style={styles.headline}>{personal?.headline}</Text>
            {personal?.summary ? (
              <Text style={styles.summary}>{personal.summary}</Text>
            ) : null}
          </View>

          {safeExperience.length ? (
            <View style={styles.section} wrap>
              <Text style={styles.sectionHeading}>Kinh nghiệm làm việc</Text>
              {safeExperience.map((item, index) => (
                <View key={item?.id || `exp-${index}`} style={styles.experienceItem} wrap>
                  <View style={styles.experienceHeader}>
                    <Text>{item?.role || ""}</Text>
                    <Text>{formatTimeline(item?.startDate, item?.endDate)}</Text>
                  </View>
                  <View style={styles.companyLine}>
                    <Text>{item?.company || ""}</Text>
                    <Text>{item?.location || ""}</Text>
                  </View>
                  {Array.isArray(item?.bulletPoints) && item.bulletPoints.length ? (
                    <View style={styles.bulletList}>
                      {item.bulletPoints.map((bullet, bulletIndex) => (
                        <Text key={`${item?.id || index}-bullet-${bulletIndex}`}>• {bullet}</Text>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}

          {safeEducation.length ? (
            <View style={styles.section} wrap>
              <Text style={styles.sectionHeading}>Học vấn</Text>
              {safeEducation.map((item, index) => (
                <View key={item?.id || `edu-${index}`} style={styles.educationItem}>
                  <Text style={{ fontWeight: 700 }}>{item?.school || ""}</Text>
                  <Text>{item?.degree || ""}</Text>
                  <Text style={{ color: "#6b7280" }}>
                    {formatTimeline(item?.startDate, item?.endDate)}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {personal?.location || contact?.email ? (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>Thông tin thêm</Text>
              <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {personal?.location ? <Text style={styles.tag}>{personal.location}</Text> : null}
                {contact?.email ? <Text style={styles.tag}>{contact.email}</Text> : null}
              </View>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
};

export default HarvardTemplate;
