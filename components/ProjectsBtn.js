import Image from "next/image";
import Link from "next/link";
import { HiArrowDown } from "react-icons/hi2";
import { profileService } from "../services";

const ProjectsBtn = () => {
  return (
    <div className="mx-auto xl:mx-0">
      <Link href={"/#"}
        onClick={(e,d)=>profileService.downloadResume(e,d)}
        className="relative w-[185px] h-[185px] flex justify-center items-center bg-circleStar bg-cover bg-center bg-no-repeat group"
      >
        <Image
          src={"/roundedText.png"}
          width={141}
          height={148}
          alt="Projects Button"
          className="animate-spin-slow w-full h-full max-w-[141px] max-h-[148px]"
        />
        <HiArrowDown className="absolute text-4xl group-hover:translate-y-2 transition-all duration-300" />
      </Link>
    </div>
  );
};

export default ProjectsBtn;