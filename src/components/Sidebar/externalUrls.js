import { ReactComponent as ForumIcon } from "../../assets/icons/forum.svg";
import { ReactComponent as GovIcon } from "../../assets/icons/governance.svg";
import { ReactComponent as DocsIcon } from "../../assets/icons/docs.svg";
import { ReactComponent as FeedbackIcon } from "../../assets/icons/feedback.svg";
import { SvgIcon } from "@material-ui/core";

const externalUrls = [
  {
    title: "Governance",
    url: "",
    icon: <SvgIcon color="primary" component={GovIcon} />,
  },
  {
    title: "Docs",
    url: "https://docs.begodao.com",
    icon: <SvgIcon color="primary" component={DocsIcon} />,
  },
];

export default externalUrls;
