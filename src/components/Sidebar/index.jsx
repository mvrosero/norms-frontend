import React from "react";
import { Text, Img } from "./..";
import { Menu, Sidebar } from "react-pro-sidebar";

export default function Sidebar1({ ...props }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Sidebar
      {...props}
      width="250px !important"
      collapsedWidth="80px !important"
      collapsed={collapsed}
      onClick={() => {
        setCollapsed(!collapsed);
      }}
    >
      <Menu
        menuItemStyles={{
          button: {
            padding: " ",
            margin: " ",
            [`&:hover, &.ps-active`]: { color: "#1814f3", fontWeight: "500 !important" },
          },
        }}
        className="flex flex-col self-stretch items-center w-full mb-[5px]"
      >
        <div className="flex flex-col w-[74%] md:w-full pt-1 gap-1">
          <div className="h-[234px] pt-1 relative">
            <div className="flex flex-col w-full pt-1 gap-1 top-[2%] right-0 left-0 m-auto absolute">
              <div className="flex self-end justify-end items-center gap-[26px] py-[17px]">
                <Img src="images/img_vector.svg" alt="vector_one" className="h-[25px] w-[25px]" />
                <Text size="md" as="p" className="!text-gray-400">
                  Dashboard
                </Text>
              </div>
              <div className="flex self-end justify-end items-center gap-[26px] py-[17px]">
                <Img src="images/img_glyph.svg" alt="glyph_one" className="h-[25px] w-[25px]" />
                <Text size="md" as="p" className="!text-gray-400">
                  Transactions
                </Text>
              </div>
            </div>
            <div className="h-[22px] w-[71%] bottom-0 right-0 m-auto absolute" />
          </div>
          <div className="h-[345px] pt-1 relative">
            <div className="flex flex-col justify-center w-full gap-1 top-[1%] right-0 left-0 m-auto absolute">
              <div className="flex self-end justify-end items-center mt-1 gap-[26px] py-[17px]">
                <Img src="images/img_user_3_1.svg" alt="user3one_one" className="h-[25px] w-[25px]" />
                <Text size="md" as="p" className="!text-gray-400">
                  Accounts
                </Text>
              </div>
              <div className="flex self-end justify-end items-center gap-[26px] py-[17px]">
                <Img src="images/img_group.svg" alt="image" className="h-[25px] w-[25px]" />
                <Text size="md" as="p" className="!text-gray-400">
                  Investments
                </Text>
              </div>
            </div>
            <div className="h-[22px] w-[68%] bottom-0 right-0 m-auto absolute" />
          </div>
          <div className="h-[502px] pt-1 relative">
            <div className="flex justify-center w-full pt-1 top-[1%] right-0 left-0 m-auto absolute">
              <div className="flex justify-end items-center gap-[26px] py-[17px]">
                <Img src="images/img_credit_card_1.svg" alt="creditcardone" className="h-[26px] w-[26px]" />
                <Text size="md" as="p" className="!text-gray-400">
                  Credit Cards
                </Text>
              </div>
            </div>
            <div className="h-[22px] w-[69%] bottom-0 right-0 m-auto absolute" />
          </div>
          <div className="pt-1">
            <div className="flex flex-col items-end pt-1 gap-[857px]">
              <div className="flex flex-col self-stretch pt-1 gap-1">
                <div className="flex self-end justify-end items-center gap-[27px] p-2.5">
                  <Img src="images/img_loan_1.svg" alt="loanone_one" className="h-[25px] w-[25px] my-[7px]" />
                  <Text size="md" as="p" className="!text-gray-400">
                    Loans
                  </Text>
                </div>
                <div className="flex self-end justify-end items-center gap-[27px] py-[17px]">
                  <Img src="images/img_service_1.svg" alt="serviceone_one" className="h-[25px] w-[25px]" />
                  <Text size="md" as="p" className="!text-gray-400">
                    Services
                  </Text>
                </div>
                <div className="flex self-end justify-end items-center gap-[27px] py-[17px]">
                  <Img src="images/img_econometrics_1.svg" alt="econometricsone" className="h-[25px] w-[25px]" />
                  <Text size="md" as="p" className="!text-gray-400">
                    My Privileges
                  </Text>
                </div>
              </div>
              <div className="h-[22px] w-[74%]" />
            </div>
          </div>
          <div className="flex justify-center pt-1">
            <div className="flex justify-end items-center gap-[29px] py-[17px]">
              <Img src="images/img_vector_indigo_a700.svg" alt="vector_three" className="h-[25px] w-[25px]" />
              <Text size="md" as="p" className="!text-gray-400">
                Setting
              </Text>
            </div>
          </div>
        </div>
      </Menu>
    </Sidebar>
  );
}