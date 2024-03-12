import React from "react";
import { CloseSVG } from "../../assets/images";
import { Img, Button, Input, Heading } from "./..";

export default function Header({ ...props }) {
  const [searchBarValue, setSearchBarValue] = React.useState("");

  return (
    <header {...props}>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="self-stretch p-5 bg-white-A700">
          <div className="flex md:flex-col justify-between items-center w-full gap-5 mx-auto md:p-5 max-w-[1359px]">
            <div className="flex justify-center items-center gap-[9px]">
              <Img src="images/img_iconfinder_vect.png" alt="iconfindervect" className="w-[36px] object-cover" />
              <Heading size="lg" as="h4" className="!font-mont">
                BankDash.
              </Heading>
            </div>
            <div className="flex md:flex-col justify-between items-center w-[82%] md:w-full gap-5">
              <Heading size="xl" as="h3" className="self-end">
                Setting
              </Heading>
              <div className="flex sm:flex-col justify-between items-center w-[46%] md:w-full gap-5">
                <Input
                  shape="round"
                  name="search"
                  placeholder="Search for something"
                  value={searchBarValue}
                  onChange={(e) => setSearchBarValue(e)}
                  prefix={<Img src="images/img_search.svg" alt="search" className="cursor-pointer" />}
                  suffix={
                    searchBarValue?.length > 0 ? (
                      <CloseSVG onClick={() => setSearchBarValue("")} fillColor="#718ebfff" />
                    ) : null
                  }
                  className="w-[50%] gap-[15px] sm:px-5 text-indigo-200"
                />
                <Button shape="circle" className="w-[50px]">
                  <Img src="images/img_settings_1.svg" />
                </Button>
                <Button shape="circle" className="w-[50px]">
                  <Img src="images/img_002_notification_1.svg" />
                </Button>
                <Img
                  src="images/img_pexels_christin.png"
                  alt="pexelschristin"
                  className="h-[60px] w-[60px] rounded-[50%]"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-px w-[83%] bg-indigo-50_01" />
      </div>
    </header>
  );
}
