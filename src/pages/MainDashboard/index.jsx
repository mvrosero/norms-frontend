import React from "react";
import { Helmet } from "react-helmet";
import { CloseSVG } from "../../assets/images/close";
import { Text, Img, Heading, Input, Button } from "../../components";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";


export default function MainDashboardPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchBarValue2, setSearchBarValue2] = React.useState("");

  return (
    <>
      <Helmet>
        <title>NORMS</title>
        <meta name="description" content="Web site created using create-react-app" />
      </Helmet>
      <div className="w-full bg-white-A700">
        <div className="self-end">
          <header>
            <div className="flex flex-col items-center justify-center">
              <div className="self-stretch p-5 bg-white-A700">
                <div className="flex md:flex-col justify-between items-start gap-5">
                  <div className="flex justify-center items-center mt-[11px] gap-[9px]">
                    <Img src="images/img_iconfinder_vect.png" alt="iconfindervect" className="w-[36px] object-cover" />
                    <Heading size="lg" as="h4" className="!font-mont">
                      NORMS
                    </Heading>
                  </div>
                  <div className="flex md:flex-col justify-between items-center w-[81%] md:w-full gap-5">
                    <Heading size="xl" as="h3">
                      Overview
                    </Heading>
                    <div className="flex sm:flex-col justify-between items-center w-[46%] md:w-full gap-5">
                      <Input
                        shape="round"
                        name="search"
                        placeholder="Search for something"
                        value={searchBarValue2}
                        onChange={(e) => setSearchBarValue2(e)}
                        prefix={<Img src="images/img_search.svg" alt="search" className="cursor-pointer" />}
                        suffix={
                          searchBarValue2?.length > 0 ? (
                            <CloseSVG onClick={() => setSearchBarValue2("")} fillColor="#718ebfff" />
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
              <div className="h-px w-[83%] bg-indigo-50_02" />
            </div>
          </header>
          <div className="flex md:flex-col justify-center items-start">
            <Sidebar
              width="252px !important"
              collapsedWidth="80px !important"
              collapsed={collapsed}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              className="flex flex-col h-screen top-0 py-[13px] !sticky overflow-auto"
            >
              <Menu
                menuItemStyles={{
                  button: {
                    padding: "17px 12px",
                    gap: "26px",
                    alignSelf: "end",
                    color: "#b1b1b1",
                    fontWeight: 500,
                    fontSize: "18px",
                    [`&:hover, &.ps-active`]: { color: "#2d60ff" },
                  },
                }}
                rootStyles={{ ["&>ul"]: { gap: "4px" } }}
                className="flex flex-col items-center w-full mb-[602px]"
              >
                <MenuItem icon={<Img src="images/img_vector.svg" alt="vector_one" className="h-[25px] w-[25px]" />}>
                  Dashboard
                </MenuItem>
                <MenuItem icon={<Img src="images/img_glyph.svg" alt="glyph_one" className="h-[25px] w-[25px]" />}>
                  Transactions
                </MenuItem>
                <MenuItem icon={<Img src="images/img_user_3_1.svg" alt="user3one_one" className="h-[25px] w-[25px]" />}>
                  Accounts
                </MenuItem>
                <MenuItem icon={<Img src="images/img_group.svg" alt="image" className="h-[25px] w-[25px]" />}>
                  Investments
                </MenuItem>
                <MenuItem
                  icon={<Img src="images/img_credit_card_1.svg" alt="creditcardone" className="h-[26px] w-[26px]" />}
                >
                  Credit Cards
                </MenuItem>
                <MenuItem icon={<Img src="images/img_loan_1.svg" alt="loanone_one" className="h-[25px] w-[25px]" />}>
                  Loans
                </MenuItem>
                <MenuItem
                  icon={<Img src="images/img_service_1.svg" alt="serviceone_one" className="h-[25px] w-[25px]" />}
                >
                  Services
                </MenuItem>
                <MenuItem
                  icon={<Img src="images/img_econometrics_1.svg" alt="econometricsone" className="h-[25px] w-[25px]" />}
                >
                  My Privileges
                </MenuItem>
                <MenuItem
                  icon={<Img src="images/img_vector_gray_400.svg" alt="vector_three" className="h-[25px] w-[25px]" />}
                >
                  Setting
                </MenuItem>
              </Menu>
            </Sidebar>
            <div className="p-6 sm:p-5 bg-gray-100 flex-1">
              <div className="flex flex-col mb-3.5 gap-[25px]">
                <div className="flex md:flex-col justify-center items-center gap-[30px]">
                  <div className="flex-1">
                    <div className="flex flex-col gap-[17px]">
                      <div className="flex justify-between items-center gap-5">
                        <Heading as="h1">My Cards</Heading>
                        <a href="#">
                          <Heading size="xs" as="h2" className="text-right">
                            See All
                          </Heading>
                        </a>
                      </div>
                      <div className="flex md:flex-col justify-center gap-[30px]">
                        <div className="w-full pt-6 sm:pt-5 bg-gradient1 rounded-[25px]">
                          <div className="flex flex-col items-center gap-[35px]">
                            <div className="flex flex-col w-[86%] md:w-full gap-[31px]">
                              <div className="flex justify-between items-center gap-5">
                                <div className="flex flex-col items-start">
                                  <Text size="xs" as="p" className="!text-white-A700 !font-lato">
                                    Balance
                                  </Text>
                                  <Text size="4xl" as="p" className="!text-white-A700 !font-lato">
                                    $5,756
                                  </Text>
                                </div>
                                <Img
                                  src="images/img_chip_card.png"
                                  alt="chipcard_one"
                                  className="self-start w-[34px] object-cover"
                                />
                              </div>
                              <div className="flex justify-between w-[76%] md:w-full gap-5">
                                <div className="flex flex-col items-start gap-0.5">
                                  <Text size="xs" as="p" className="!text-white-A700_b2 !font-lato">
                                    CARD HOLDER
                                  </Text>
                                  <Text size="lg" as="p" className="self-center !text-white-A700 !font-lato !font-thin">
                                    Eddy Cusuma
                                  </Text>
                                </div>
                                <div className="flex flex-col items-start gap-0.5">
                                  <Text size="xs" as="p" className="!text-white-A700_b2 !font-lato">
                                    VALID THRU
                                  </Text>
                                  <Text size="lg" as="p" className="!text-white-A700 !font-lato !font-thin">
                                    12/22
                                  </Text>
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch">
                              <div className="p-5 rounded-bl-[25px] rounded-br-[25px] bg-gradient">
                                <div className="flex justify-between items-center gap-5">
                                  <Text size="5xl" as="p" className="self-end !text-white-A700 !font-lato">
                                    3778 **** **** 1234
                                  </Text>
                                  <Img src="images/img_group_17.svg" alt="image_one" className="h-[30px]" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center w-full pt-6 gap-[39px] sm:pt-5 border-teal-50 border border-solid bg-white-A700 rounded-[25px]">
                          <div className="flex justify-between items-center w-[86%] md:w-full gap-5">
                            <div className="flex flex-col items-start gap-[27px]">
                              <div className="flex flex-col items-start">
                                <Text size="xs" as="p" className="!font-lato">
                                  Balance
                                </Text>
                                <Text size="4xl" as="p" className="!text-blue_gray-800_01 !font-lato">
                                  $5,756
                                </Text>
                              </div>
                              <div className="flex flex-col items-start gap-0.5">
                                <Text size="xs" as="p" className="!font-lato">
                                  CARD HOLDER
                                </Text>
                                <Text
                                  size="lg"
                                  as="p"
                                  className="self-center !text-blue_gray-800_01 !font-lato !font-thin"
                                >
                                  Eddy Cusuma
                                </Text>
                              </div>
                            </div>
                            <div className="flex justify-between w-[48%] gap-5">
                              <div className="flex flex-col items-start mt-[66px] gap-0.5">
                                <Text size="xs" as="p" className="!font-lato">
                                  VALID THRU
                                </Text>
                                <Text size="lg" as="p" className="!text-blue_gray-800_01 !font-lato !font-thin">
                                  12/22
                                </Text>
                              </div>
                              <Img
                                src="images/img_chip_card.png"
                                alt="chipcard_three"
                                className="w-[34px] object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex self-stretch justify-between items-center gap-5 p-5 rounded-bl-[25px] rounded-br-[25px] border-teal-50_01 border border-solid">
                            <Text size="5xl" as="p" className="self-end !text-blue_gray-800_01 !font-lato">
                              3778 **** **** 1234
                            </Text>
                            <Img
                              src="images/img_group_17_blue_gray_300.svg"
                              alt="image_two"
                              className="h-[30px] mr-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-[32%] md:w-full gap-[19px]">
                    <Heading as="h3">Recent Transaction</Heading>
                    <div className="p-6 sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="flex flex-col gap-2.5">
                        <div className="flex justify-center flex-1">
                          <div className="flex justify-center items-center gap-[17px]">
                            <Button color="orange_50" size="xl" shape="round" className="w-[55px]">
                              <Img src="images/img_iconfinder_busi.svg" />
                            </Button>
                            <div className="flex flex-col self-end items-start gap-[5px]">
                              <Text as="p" className="!text-gray-900 !font-medium">
                                Deposit from my Card
                              </Text>
                              <Text size="lg" as="p">
                                28 January 2021
                              </Text>
                            </div>
                            <Text as="p" className="!text-red-A200 text-right !font-medium">
                              -$850
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-center flex-1">
                          <div className="flex justify-center items-center">
                            <Button color="blue_50" size="xl" shape="round" className="w-[55px]">
                              <Img src="images/img_iconfinder_payp.svg" />
                            </Button>
                            <div className="flex flex-col self-end gap-[5px]">
                              <Text as="p" className="!text-gray-900 !font-medium">
                                Deposit Paypal
                              </Text>
                              <Text size="lg" as="p">
                                25 January 2021
                              </Text>
                            </div>
                            <Text as="p" className="ml-[46px] !text-teal-300 text-right !font-medium">
                              +$2,500
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-center items-center">
                          <Button color="cyan_50" size="xl" shape="round" className="w-[55px]">
                            <Img src="images/img_iconfinder_6_4753731.svg" />
                          </Button>
                          <div className="flex flex-col items-start ml-[17px] gap-[7px]">
                            <Text as="p" className="!text-gray-900 !font-medium">
                              Jemi Wilson
                            </Text>
                            <Text size="lg" as="p">
                              21 January 2021
                            </Text>
                          </div>
                          <Text as="p" className="ml-12 !text-teal-300 text-right !font-medium">
                            +$5,400
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-center gap-[30px]">
                  <div className="flex flex-col gap-[15px] flex-1">
                    <Heading as="h4">Weekly Activity</Heading>
                    <div className="p-[26px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="flex flex-col items-end gap-5">
                        <div className="flex justify-end w-[30%] md:w-full gap-[30px]">
                          <div className="flex self-end justify-end items-center w-[45%] gap-2.5">
                            <div className="self-start h-[15px] w-[15px] bg-teal-A400_01 rounded-[7px]" />
                            <Text size="lg" as="p">
                              Diposit
                            </Text>
                          </div>
                          <div className="flex self-start justify-end items-center gap-2.5 flex-1">
                            <div className="self-end h-[15px] w-[15px] bg-pink-A100 rounded-[7px]" />
                            <Text size="lg" as="p">
                              Withdraw
                            </Text>
                          </div>
                        </div>
                        <div className="self-stretch h-[226px] relative">
                          <div className="flex flex-col w-[95%] gap-9 right-0 top-[3%] m-auto absolute">
                            <div className="h-px bg-gray-100_04" />
                            <div className="h-px bg-gray-100_04" />
                            <div className="h-px bg-gray-100_04" />
                            <div className="h-px bg-gray-100_04" />
                            <div className="h-px bg-gray-100_04" />
                            <div className="h-px bg-gray-100_04" />
                          </div>
                          <div className="flex justify-center w-max h-full left-0 bottom-0 right-0 top-0 m-auto absolute">
                            <div className="flex flex-col items-end w-full gap-2">
                              <div className="flex md:flex-col self-stretch justify-between items-center gap-5">
                                <div className="flex flex-col items-center gap-[21px]">
                                  <Text size="s" as="p" className="text-right">
                                    500
                                  </Text>
                                  <Text size="s" as="p" className="text-right">
                                    400
                                  </Text>
                                  <Text size="s" as="p" className="text-right">
                                    300
                                  </Text>
                                  <Text size="s" as="p" className="text-right">
                                    200
                                  </Text>
                                  <Text size="s" as="p" className="self-start text-right">
                                    100
                                  </Text>
                                  <Text size="s" as="p" className="self-end text-right">
                                    0
                                  </Text>
                                </div>
                                <Img src="images/img_group_39.svg" alt="image_three" className="h-[178px] md:w-full" />
                              </div>
                              <div className="flex justify-between w-[89%] md:w-full mr-[13px] gap-5">
                                <Text size="s" as="p" className="text-center">
                                  Sat
                                </Text>
                                <Text size="s" as="p" className="text-center">
                                  Sun
                                </Text>
                                <Text size="s" as="p" className="text-center">
                                  Mon
                                </Text>
                                <Text size="s" as="p" className="text-center">
                                  Tue
                                </Text>
                                <Text size="s" as="p" className="text-center">
                                  Wed
                                </Text>
                                <Text size="s" as="p" className="text-center">
                                  Thu
                                </Text>
                                <Text size="s" as="p" className="h-[16px] text-center">
                                  Fri
                                </Text>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-[32%] md:w-full gap-[15px]">
                    <Heading as="h5">Expense Statistics</Heading>
                    <div className="p-[31px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="h-[259px] relative">
                        <Img
                          src="images/img_group_blue_gray_800_01.svg"
                          alt="image_four"
                          className="justify-center h-[259px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                        />
                        <div className="flex flex-col w-[85%] gap-[9px] top-[13%] right-0 left-0 m-auto absolute">
                          <Text
                            size="s"
                            as="p"
                            className="flex w-[56%] md:w-full ml-12 !text-white-A700 text-center !font-medium leading-[18px]"
                          >
                            <span className="text-white-A700 text-base font-bold">
                              <>
                                30%
                                <br />
                              </>
                            </span>
                            <span className="text-white-A700 font-bold">Entertainment</span>
                          </Text>
                          <Text
                            size="s"
                            as="p"
                            className="flex ml-[143px] !text-white-A700 text-center !font-medium leading-[18px]"
                          >
                            <span className="text-white-A700 text-base font-bold">
                              <>
                                15%
                                <br />
                              </>
                            </span>
                            <span className="text-white-A700 font-bold">Bill Expense</span>
                          </Text>
                          <div className="flex justify-between w-[82%] md:w-full gap-5">
                            <Text
                              size="s"
                              as="p"
                              className="flex w-[42%] mb-[30px] !text-white-A700 text-center !font-medium leading-[18px]"
                            >
                              <span className="text-white-A700 text-base font-bold">
                                <>
                                  20%
                                  <br />
                                </>
                              </span>
                              <span className="text-white-A700 font-bold">Investment</span>
                            </Text>
                            <Text
                              size="s"
                              as="p"
                              className="flex w-[26%] mt-[30px] !text-white-A700 text-center !font-medium leading-[18px]"
                            >
                              <span className="text-white-A700 text-base font-bold">
                                <>
                                  35%
                                  <br />
                                </>
                              </span>
                              <span className="text-white-A700 font-bold">Others</span>
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-center items-center gap-[30px]">
                  <div className="flex flex-col w-[41%] md:w-full gap-[19px]">
                    <Heading as="h6">Quick Transfer</Heading>
                    <div className="flex flex-col gap-[27px] p-[25px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="flex justify-between items-center mt-2.5 gap-5">
                        <div className="flex flex-col w-[22%] gap-3.5">
                          <div className="ml-[5px]">
                            <Img
                              src="images/img_pexels_julia_volk_5273755.png"
                              alt="pexelsjulia_one"
                              className="h-[70px] w-[70px] rounded-[50%]"
                            />
                          </div>
                          <div className="flex flex-col self-center items-center gap-[5px]">
                            <Text as="p" className="!text-gray-900">
                              Livia Bator
                            </Text>
                            <Text size="lg" as="p">
                              CEO
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col items-center w-[24%] gap-[15px]">
                          <div className="w-[74%] md:w-full">
                            <Img
                              src="images/img_marcel_strauss.png"
                              alt="marcelstrauss"
                              className="h-[70px] w-[70px] rounded-[50%]"
                            />
                          </div>
                          <div className="flex flex-col items-center gap-0.5">
                            <Text as="p" className="!text-gray-900">
                              Randy Press
                            </Text>
                            <Text size="lg" as="p">
                              Director
                            </Text>
                          </div>
                        </div>
                        <div className="flex flex-col w-[18%] gap-3.5">
                          <div>
                            <div>
                              <div>
                                <Img
                                  src="images/img_austin_distel_7.png"
                                  alt="austindistelsev"
                                  className="h-[70px] w-[70px] rounded-[50%]"
                                />
                                <Img
                                  src="images/img_emanuel_minca_j.png"
                                  alt="emanuelmincaj"
                                  className="h-[70px] w-[70px] mt-[-70px] rounded-[50%]"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-[5px]">
                            <Text as="p" className="!text-gray-900">
                              Workman
                            </Text>
                            <Text size="lg" as="p">
                              Designer
                            </Text>
                          </div>
                        </div>
                        <Button color="white_A700" shape="circle" className="w-[50px]">
                          <Img src="images/img_arrow_right.svg" />
                        </Button>
                      </div>
                      <div className="flex sm:flex-col justify-center items-center mb-2.5 gap-[27px]">
                        <Text as="p">Write Amount</Text>
                        <Input
                          color="blue_gray_50_02"
                          shape="round"
                          name="vector_four"
                          placeholder="525.50"
                          suffix={
                            <div className="flex justify-center items-center w-[26px] h-[22px]">
                              <Img src="images/img_vector_white_a700.svg" alt="Vector" />
                            </div>
                          }
                          className="gap-[35px] sm:px-5 flex-1"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[17px] flex-1">
                    <Heading as="h5">Balance History</Heading>
                    <div className="p-[23px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="mt-[3px] mb-1">
                        <div className="flex sm:flex-col justify-center items-start">
                          <div className="flex flex-col items-end w-[7%] sm:w-full gap-[30px] z-[1]">
                            <div className="flex self-stretch justify-end items-center gap-2">
                              <Text size="s" as="p" className="text-right">
                                800
                              </Text>
                              <div className="h-px w-[21%] bg-indigo-300" />
                            </div>
                            <div className="flex self-stretch justify-end items-center gap-2">
                              <Text size="s" as="p" className="text-right">
                                600
                              </Text>
                              <div className="h-px w-[21%] bg-indigo-300" />
                            </div>
                            <div className="flex self-stretch justify-end items-center gap-2">
                              <Text size="s" as="p" className="text-right">
                                400
                              </Text>
                              <div className="h-px w-[20%] bg-indigo-300" />
                            </div>
                            <div className="flex self-stretch justify-end items-center gap-[7px]">
                              <Text size="s" as="p" className="text-right">
                                200
                              </Text>
                              <div className="h-px w-[21%] bg-indigo-300" />
                            </div>
                            <div className="flex justify-end items-center w-[58%] md:w-full gap-2">
                              <Text size="xs" as="p" className="text-right">
                                0
                              </Text>
                              <div className="self-end h-px w-full bg-indigo-300" />
                            </div>
                          </div>
                          <div className="flex flex-col mt-[7px] ml-[-1px] flex-1">
                            <div className="h-[185px] relative">
                              <Img
                                src="images/img_group_indigo_50.svg"
                                alt="image_five"
                                className="justify-center h-[185px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                              />
                              <Img
                                src="images/img_vector_indigo_a700_177x547.png"
                                alt="vector_sixteen"
                                className="justify-center h-[177px] w-full left-0 bottom-0 right-0 top-0 m-auto object-cover absolute"
                              />
                            </div>
                            <div className="flex w-[90%] md:w-full">
                              <div className="flex flex-col w-full gap-1">
                                <div className="flex justify-between gap-5">
                                  <Img src="images/img_group_indigo_300.svg" alt="image_six" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_seven" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_eight" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_nine" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_ten" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_eleven" className="h-[4px]" />
                                  <Img src="images/img_group_indigo_300.svg" alt="image_twelve" className="h-[4px]" />
                                </div>
                                <div className="flex sm:flex-col justify-between gap-5">
                                  <div className="flex justify-between w-[19%] sm:w-full gap-5">
                                    <Text size="md" as="p" className="self-start h-[17px]">
                                      Jul
                                    </Text>
                                    <Text size="md" as="p" className="self-end">
                                      Aug
                                    </Text>
                                  </div>
                                  <div className="flex justify-between w-[68%] sm:w-full gap-5">
                                    <Text size="md" as="p" className="self-end">
                                      Sep
                                    </Text>
                                    <Text size="md" as="p" className="self-start">
                                      Oct
                                    </Text>
                                    <Text size="md" as="p" className="self-start">
                                      Nov{" "}
                                    </Text>
                                    <Text size="md" as="p" className="self-start">
                                      Dec
                                    </Text>
                                    <Text size="md" as="p" className="self-start">
                                      Jan
                                    </Text>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
