import React from "react";
import { Helmet } from "react-helmet";
import { Button, Input, Text, Switch, Img } from "../../components";
import Header from "../../components/Header";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

export default function SettingPageThreePage() {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      <Helmet>
        <title>NORMS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-A700">
        <div className="self-end">
          <Header />
          <div className="flex md:flex-col justify-center items-start">
            <Sidebar
              width="252px !important"
              collapsedWidth="80px !important"
              collapsed={collapsed}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              className="flex flex-col h-screen pr-[30px] top-0 py-[30px] sm:pr-5 sm:py-5 !sticky overflow-auto"
            >
              <Menu
                menuItemStyles={{
                  button: {
                    padding: 0,
                    gap: "26px",
                    alignSelf: "end",
                    color: "#b1b1b1",
                    fontWeight: 500,
                    fontSize: "18px",
                    paddingTop: "17px",
                    paddingBottom: "17px",
                    [`&:hover, &.ps-active`]: { color: "#1814f3" },
                  },
                }}
                className="flex flex-col self-stretch items-center w-full mb-[5px]"
              >
                <div className="flex flex-col w-[74%] md:w-full pt-1 gap-1">
                  <div className="h-[234px] pt-1 relative">
                    <div className="flex flex-col w-full pt-1 gap-1 top-[2%] right-0 left-0 m-auto absolute">
                      <MenuItem
                        icon={
                          <Img
                            src="images/img_vector_gray_400_25x25.svg"
                            alt="vector_one"
                            className="h-[25px] w-[25px]"
                          />
                        }
                      >
                        Dashboard
                      </MenuItem>
                      <MenuItem icon={<Img src="images/img_glyph.svg" alt="glyph_one" className="h-[25px] w-[25px]" />}>
                        Transactions
                      </MenuItem>
                    </div>
                    <div className="h-[22px] w-[71%] bottom-0 right-0 m-auto absolute" />
                  </div>
                  <div className="h-[345px] pt-1 relative">
                    <div className="flex flex-col justify-center w-full gap-1 top-[1%] right-0 left-0 m-auto absolute">
                      <MenuItem
                        icon={<Img src="images/img_user_3_1.svg" alt="user3one_one" className="h-[25px] w-[25px]" />}
                      >
                        Accounts
                      </MenuItem>
                      <MenuItem icon={<Img src="images/img_group.svg" alt="image" className="h-[25px] w-[25px]" />}>
                        Investments
                      </MenuItem>
                    </div>
                    <div className="h-[22px] w-[68%] bottom-0 right-0 m-auto absolute" />
                  </div>
                  <div className="h-[502px] pt-1 relative">
                    <div className="flex justify-center w-full pt-1 top-[1%] right-0 left-0 m-auto absolute">
                      <MenuItem
                        icon={
                          <Img src="images/img_credit_card_1.svg" alt="creditcardone" className="h-[26px] w-[26px]" />
                        }
                      >
                        Credit Cards
                      </MenuItem>
                    </div>
                    <div className="h-[22px] w-[69%] bottom-0 right-0 m-auto absolute" />
                  </div>
                  <div className="pt-1">
                    <div className="flex flex-col items-end pt-1 gap-[857px]">
                      <div className="flex flex-col self-stretch pt-1 gap-1">
                        <MenuItem
                          icon={<Img src="images/img_loan_1.svg" alt="loanone_one" className="h-[25px] w-[25px]" />}
                        >
                          Loans
                        </MenuItem>
                        <MenuItem
                          icon={
                            <Img src="images/img_service_1.svg" alt="serviceone_one" className="h-[25px] w-[25px]" />
                          }
                        >
                          Services
                        </MenuItem>
                        <MenuItem
                          icon={
                            <Img
                              src="images/img_econometrics_1.svg"
                              alt="econometricsone"
                              className="h-[25px] w-[25px]"
                            />
                          }
                        >
                          My Privileges
                        </MenuItem>
                      </div>
                      <div className="h-[22px] w-[74%]" />
                    </div>
                  </div>
                  <div className="flex justify-center pt-1">
                    <MenuItem
                      icon={
                        <Img src="images/img_vector_indigo_a700.svg" alt="vector_three" className="h-[25px] w-[25px]" />
                      }
                    >
                      Setting
                    </MenuItem>
                  </div>
                </div>
              </Menu>
            </Sidebar>
            <div className="p-[30px] sm:p-5 bg-gray-100 flex-1">
              <div className="flex flex-col items-start mb-[332px] gap-[33px] p-[30px] sm:p-5 bg-white-A700 rounded-[25px]">
                <div className="self-stretch mt-1.5">
                  <div className="flex flex-col">
                    <div className="flex justify-between w-[38%] md:w-full ml-4 gap-5">
                      <Text as="p" className="self-start !font-medium">
                        Edit Profile
                      </Text>
                      <Text as="p" className="self-start !font-medium">
                        Preferences
                      </Text>
                      <Text as="p" className="self-end !text-indigo-A700 !font-medium">
                        Security
                      </Text>
                    </div>
                    <div className="h-[3px] w-[16%] mt-1.5 ml-[315px] rounded-tl-[10px] rounded-tr-[10px] z-[1] bg-indigo-A700" />
                    <div className="h-px mt-[-1px] bg-gray-100_03" />
                  </div>
                </div>
                <div className="flex flex-col w-[49%] md:w-full">
                  <Text size="2xl" as="p" className="!text-blue_gray-800">
                    Two-factor Authentication
                  </Text>
                  <div className="flex sm:flex-col items-center mt-[18px] gap-5">
                    <Switch shape="square" />
                    <Text as="p" className="!text-gray-900">
                      Enable or disable two factor authentication
                    </Text>
                  </div>
                  <Text size="2xl" as="p" className="mt-[29px] !text-blue_gray-800">
                    Change Password
                  </Text>
                  <div className="flex flex-col mt-[13px] gap-2.5">
                    <Text as="p" className="!text-gray-900">
                      Current Password
                    </Text>
                    <Input
                      color="white_A700"
                      type="password"
                      name="password"
                      placeholder="**********"
                      className="sm:pr-5 border-teal-50_01 border border-solid rounded-[15px]"
                    />
                  </div>
                  <div className="flex flex-col mt-[21px] gap-2.5">
                    <Text as="p" className="!text-gray-900">
                      New Password
                    </Text>
                    <Input
                      color="white_A700"
                      type="password"
                      name="newpassword"
                      placeholder="**********"
                      className="sm:pr-5 border-teal-50_01 border border-solid rounded-[15px]"
                    />
                  </div>
                </div>
                <Button color="indigo_A700" size="md" className="w-full ml-[860px] sm:px-5 font-medium rounded-[15px]">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
