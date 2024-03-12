import React from "react";
import { Helmet } from "react-helmet";
import { CloseSVG } from "../../assets/images";
import { Text, Heading, Button, Img, Input } from "../../components";
import { ReactTable } from "../../components/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

const table1Data = [
  { slno: "01.", name: "Trivago", price: "$520", return: "+5%" },
  { slno: "02.", name: "Canon", price: "$480", return: "+10%" },
  { slno: "03.", name: "Uber Food", price: "$350", return: "-3%" },
  { slno: "04.", name: "Nokia", price: "$940", return: "+2%" },
  { slno: "05.", name: "Tiktok", price: "$670", return: "-12%" },
];

export default function InvestmentsPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [searchBarValue3, setSearchBarValue3] = React.useState("");
  const table1Columns = React.useMemo(() => {
    const table1ColumnHelper = createColumnHelper();
    return [
      table1ColumnHelper.accessor("slno", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2 pl-[30px] sm:pl-5 !font-medium">
            SL No
          </Text>
        ),
        meta: { width: "112px" },
      }),
      table1ColumnHelper.accessor("name", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2 !font-medium">
            Name
          </Text>
        ),
        meta: { width: "131px" },
      }),
      table1ColumnHelper.accessor("price", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pb-2 !font-medium">
            Price
          </Text>
        ),
        meta: { width: "104px" },
      }),
      table1ColumnHelper.accessor("return", {
        cell: (info) => (
          <Text as="p" className="!text-teal-A400 !font-medium">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2 !font-medium">
            Return
          </Text>
        ),
        meta: { width: "98px" },
      }),
    ];
  }, []);

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
                <div className="flex md:flex-col justify-between items-center gap-5">
                  <div className="flex justify-center items-center gap-[9px]">
                    <Img src="images/img_iconfinder_vect.png" alt="iconfindervect" className="w-[36px] object-cover" />
                    <Heading size="lg" as="h4" className="!font-mont">
                      BankDash.
                    </Heading>
                  </div>
                  <div className="flex md:flex-col justify-between items-center w-[82%] md:w-full gap-5">
                    <Heading size="xl" as="h3">
                      Investments
                    </Heading>
                    <div className="flex sm:flex-col justify-between items-center w-[46%] md:w-full gap-5">
                      <Input
                        shape="round"
                        name="search"
                        placeholder="Search for something"
                        value={searchBarValue3}
                        onChange={(e) => setSearchBarValue3(e)}
                        prefix={<Img src="images/img_search.svg" alt="search" className="cursor-pointer" />}
                        suffix={
                          searchBarValue3?.length > 0 ? (
                            <CloseSVG onClick={() => setSearchBarValue3("")} fillColor="#718ebfff" />
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
                    alignSelf: "start",
                    color: "#b1b1b1",
                    fontWeight: 500,
                    fontSize: "18px",
                    paddingTop: "19px",
                    paddingBottom: "19px",
                    [`&:hover, &.ps-active`]: { color: "#1814f3" },
                  },
                }}
                className="flex flex-col self-stretch items-end w-full mb-[400px] px-2.5"
              >
                <div className="w-[82%] md:w-full">
                  <div className="h-[212px] relative">
                    <div className="flex flex-col w-full gap-[0.19px] top-0 right-0 left-0 m-auto absolute">
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
                  <div className="flex flex-col gap-[0.18px]">
                    <MenuItem
                      icon={<Img src="images/img_user_3_1.svg" alt="user3one_one" className="h-[25px] w-[25px]" />}
                    >
                      Accounts
                    </MenuItem>
                    <MenuItem
                      icon={<Img src="images/img_group_indigo_a700.svg" alt="image" className="h-[25px] w-[25px]" />}
                    >
                      Investments
                    </MenuItem>
                    <MenuItem
                      icon={
                        <Img src="images/img_credit_card_1.svg" alt="creditcardone" className="h-[26px] w-[26px]" />
                      }
                    >
                      Credit Cards
                    </MenuItem>
                    <MenuItem
                      icon={<Img src="images/img_loan_1.svg" alt="loanone_one" className="h-[25px] w-[25px]" />}
                    >
                      Loans
                    </MenuItem>
                    <MenuItem
                      icon={<Img src="images/img_service_1.svg" alt="serviceone_one" className="h-[25px] w-[25px]" />}
                    >
                      Services
                    </MenuItem>
                    <MenuItem
                      icon={
                        <Img src="images/img_econometrics_1.svg" alt="econometricsone" className="h-[25px] w-[25px]" />
                      }
                    >
                      My Privileges
                    </MenuItem>
                    <MenuItem
                      icon={
                        <Img src="images/img_vector_gray_400.svg" alt="vector_three" className="h-[25px] w-[25px]" />
                      }
                    >
                      Setting
                    </MenuItem>
                  </div>
                </div>
              </Menu>
            </Sidebar>
            <div className="p-[30px] sm:p-5 bg-gray-100 flex-1">
              <div className="flex flex-col mb-[21px] gap-[26px]">
                <div className="flex md:flex-col gap-[30px]">
                  <div className="flex justify-between items-center gap-5 p-[25px] sm:p-5 bg-white-A700 rounded-[25px]">
                    <Button color="cyan_50" size="3xl" shape="circle" className="w-[70px] ml-[23px]">
                      <Img src="images/img_money_bag_of_dollars.svg" />
                    </Button>
                    <div className="flex flex-col items-start mr-[22px] gap-[7px]">
                      <Text as="p">Total Invested Amount</Text>
                      <Heading size="s" as="h1" className="!text-gray-900">
                        $150,000
                      </Heading>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-5 p-[25px] sm:p-5 bg-white-A700 rounded-[25px]">
                    <Button color="pink_50" size="3xl" shape="circle" className="w-[70px] ml-[19px]">
                      <Img src="images/img_group_305.svg" />
                    </Button>
                    <div className="flex flex-col items-start mr-[19px] gap-2">
                      <Text as="p">Number of Investments</Text>
                      <Heading size="s" as="h2" className="!text-gray-900">
                        1,250
                      </Heading>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-5 p-[25px] sm:p-5 bg-white-A700 rounded-[25px]">
                    <Button color="blue_50" size="3xl" shape="circle" className="w-[70px] ml-[53px]">
                      <Img src="images/img_repeat_1.svg" />
                    </Button>
                    <div className="flex flex-col items-start mr-[53px] gap-[7px]">
                      <Text as="p">Rate of Return</Text>
                      <Heading size="s" as="h3" className="!text-gray-900">
                        +5.80%
                      </Heading>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-[30px]">
                  <div className="flex flex-col w-full gap-[17px]">
                    <Heading as="h4" className="!text-blue_gray-800">
                      Yearly Total Investment
                    </Heading>
                    <div className="p-[26px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="flex sm:flex-col justify-between items-start gap-5">
                        <div className="flex flex-col items-end gap-[31px]">
                          <Text size="s" as="p" className="text-right">
                            $40,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $30,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $20,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $10,000
                          </Text>
                          <Text size="s" as="p" className="h-[16px] text-right">
                            $0
                          </Text>
                        </div>
                        <div className="flex flex-col mt-[13px] flex-1">
                          <div className="h-px border-indigo-50 border border-dashed" />
                          <div className="h-[161px] mt-1.5 relative">
                            <div className="flex flex-col w-full gap-[47px] bottom-[14%] right-0 left-0 m-auto absolute">
                              <div className="h-px border-indigo-50 border border-dashed" />
                              <div className="h-px border-indigo-50 border border-dashed" />
                              <div className="h-px border-indigo-50 border border-dashed" />
                            </div>
                            <Img
                              src="images/img_statistics.svg"
                              alt="image"
                              className="justify-center h-[161px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                            />
                          </div>
                          <div className="h-px mt-[22px] border-indigo-50 border border-dashed" />
                          <div className="flex justify-between mt-[7px] gap-5">
                            <Text size="s" as="p" className="text-center">
                              2016
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2017
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2018
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2019
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2020
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2021
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-full gap-[17px]">
                    <Heading as="h5" className="!text-blue_gray-800">
                      Monthly Revenue
                    </Heading>
                    <div className="p-[26px] sm:p-5 bg-white-A700 rounded-[25px]">
                      <div className="flex sm:flex-col justify-between items-start gap-5">
                        <div className="flex flex-col items-end gap-[31px]">
                          <Text size="s" as="p" className="text-right">
                            $40,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $30,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $20,000
                          </Text>
                          <Text size="s" as="p" className="text-right">
                            $10,000
                          </Text>
                          <Text size="s" as="p" className="h-[16px] text-right">
                            $0
                          </Text>
                        </div>
                        <div className="flex flex-col mt-[13px] flex-1">
                          <div className="h-px border-indigo-50 border border-dashed" />
                          <div className="h-[111px] mt-[25px] relative">
                            <div className="flex flex-col w-full gap-[47px] top-[20%] right-0 left-0 m-auto absolute">
                              <div className="h-px border-indigo-50 border border-dashed" />
                              <div className="h-px border-indigo-50 border border-dashed" />
                            </div>
                            <Img
                              src="images/img_vector_6.svg"
                              alt="vectorsix_one"
                              className="justify-center h-[111px] left-0 bottom-0 right-0 top-0 m-auto absolute"
                            />
                          </div>
                          <div className="h-px mt-[7px] border-indigo-50 border border-dashed" />
                          <div className="h-px mt-[45px] border-indigo-50 border border-dashed" />
                          <div className="flex justify-between mt-[7px] gap-5">
                            <Text size="s" as="p" className="text-center">
                              2016
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2017
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2018
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2019
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2020
                            </Text>
                            <Text size="s" as="p" className="text-center">
                              2021
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-center gap-[30px]">
                  <div className="flex flex-col gap-[15px] flex-1">
                    <Heading as="h6" className="!text-blue_gray-800">
                      My Investment
                    </Heading>
                    <div className="flex flex-col gap-[15px]">
                      <div className="flex sm:flex-col items-center p-[15px] bg-white-A700 rounded-[20px]">
                        <Button color="pink_50_01" size="2xl" className="w-[60px] rounded-[20px]">
                          <Img src="images/img_group_245.svg" />
                        </Button>
                        <div className="flex flex-col items-start ml-5 gap-[5px]">
                          <Text as="p" className="!text-gray-900 !font-medium">
                            Apple Store
                          </Text>
                          <Text size="lg" as="p">
                            E-commerce, Marketplace
                          </Text>
                        </div>
                        <div className="flex flex-col items-start ml-14 gap-[5px]">
                          <Text as="p" className="!text-gray-900 !font-medium">
                            $54,000
                          </Text>
                          <Text size="lg" as="p">
                            Envestment Value
                          </Text>
                        </div>
                        <div className="flex flex-col items-start ml-11 gap-[5px]">
                          <Text as="p" className="!text-teal-A400 !font-medium">
                            +16%
                          </Text>
                          <Text size="lg" as="p">
                            Return Value
                          </Text>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center p-[15px] bg-white-A700 rounded-[20px]">
                        <Button color="blue_50" size="2xl" className="w-[60px] rounded-[20px]">
                          <Img src="images/img_group_875.svg" />
                        </Button>
                        <div className="flex flex-col items-start ml-5 gap-[5px]">
                          <Text as="p" className="!text-gray-900 !font-medium">
                            Samsung Mobile
                          </Text>
                          <Text size="lg" as="p">
                            E-commerce, Marketplace
                          </Text>
                        </div>
                        <div className="flex flex-col items-start ml-14 gap-[5px]">
                          <Text as="p" className="!text-gray-900 !font-medium">
                            $25,300
                          </Text>
                          <Text size="lg" as="p">
                            Envestment Value
                          </Text>
                        </div>
                        <div className="flex flex-col items-start ml-11 gap-[5px]">
                          <Text as="p" className="!text-pink-A200 !font-medium">
                            -4%
                          </Text>
                          <Text size="lg" as="p">
                            Return Value
                          </Text>
                        </div>
                      </div>
                      <div className="flex sm:flex-col justify-between items-center gap-5 p-[15px] bg-white-A700 flex-1 rounded-[20px]">
                        <div className="flex justify-between items-center gap-5">
                          <Button color="orange_50" size="2xl" className="w-[60px] rounded-[20px]">
                            <Img src="images/img_group_876.svg" />
                          </Button>
                          <div className="flex flex-col items-start gap-[5px]">
                            <Text as="p" className="!text-gray-900 !font-medium">
                              Tesla Motors
                            </Text>
                            <Text size="lg" as="p">
                              Electric Vehicles
                            </Text>
                          </div>
                        </div>
                        <div className="flex justify-between w-[45%] sm:w-full mr-[21px] gap-5">
                          <div className="flex flex-col items-start gap-[5px]">
                            <Text as="p" className="!text-gray-900 !font-medium">
                              $8,200
                            </Text>
                            <Text size="lg" as="p">
                              Envestment Value
                            </Text>
                          </div>
                          <div className="flex flex-col items-start gap-[5px]">
                            <Text as="p" className="!text-teal-A400 !font-medium">
                              +25%
                            </Text>
                            <Text size="lg" as="p">
                              Return Value
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col w-[41%] md:w-full gap-[41px]">
                    <Heading as="h5" className="!text-blue_gray-800">
                      Trending Stock
                    </Heading>
                    <ReactTable
                      size="xs"
                      bodyProps={{ className: "" }}
                      headerProps={{ className: "sm:flex-col" }}
                      rowDataProps={{ className: "sm:flex-col" }}
                      className="w-[445px] bg-white-A700 rounded-[25px]"
                      columns={table1Columns}
                      data={table1Data}
                    />
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
