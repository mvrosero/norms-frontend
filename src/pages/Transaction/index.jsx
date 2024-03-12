import React from "react";
import { Helmet } from "react-helmet";
import { Img, Text, Button, Heading } from "../../components";
import Header from "../../components/Header";
import { ReactTable } from "../../components/ReactTable";
import { createColumnHelper } from "@tanstack/react-table";
import { MenuItem, Menu, Sidebar } from "react-pro-sidebar";

const tableData = [
  {
    description: "Spotify Subscription",
    transactionid: "#12548796",
    type: "Shopping",
    card: "1234 ****",
    date: "28 Jan, 12.30 AM",
    amount: "-$2,500",
    receipt: "Download",
  },
  {
    description: "Freepik Sales",
    transactionid: "#12548796",
    type: "Transfer",
    card: "1234 ****",
    date: "25 Jan, 10.40 PM",
    amount: "+$750",
    receipt: "Download",
  },
  {
    description: "Mobile Service",
    transactionid: "#12548796",
    type: "Service",
    card: "1234 ****",
    date: "20 Jan, 10.40 PM",
    amount: "-$150",
    receipt: "Download",
  },
  {
    description: "Wilson",
    transactionid: "#12548796",
    type: "Transfer",
    card: "1234 ****",
    date: "15 Jan, 03.29 PM",
    amount: "-$1050",
    receipt: "Download",
  },
  {
    description: "Emilly",
    transactionid: "#12548796",
    type: "Transfer",
    card: "1234 ****",
    date: "14 Jan, 10.40 PM",
    amount: "+$840",
    receipt: "Download",
  },
];

export default function TransactionPage() {
  const [collapsed, setCollapsed] = React.useState(false);
  const tableColumns = React.useMemo(() => {
    const tableColumnHelper = createColumnHelper();
    return [
      tableColumnHelper.accessor("description", {
        cell: (info) => (
          <div className="flex justify-center items-start gap-3.5">
            <Button color="indigo_300" size="xs" variant="outline" shape="circle" className="w-[30px]">
              <Img src="images/img_group_73.svg" />
            </Button>
            <Text as="p" className="mt-1.5 !text-gray-900">
              {info?.getValue?.()}
            </Text>
          </div>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2.5 pl-[30px] sm:pl-5 !font-medium">
            Description
          </Text>
        ),
        meta: { width: "259px" },
      }),
      tableColumnHelper.accessor("transactionid", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pb-[11px] px-px !font-medium">
            Transaction ID
          </Text>
        ),
        meta: { width: "154px" },
      }),
      tableColumnHelper.accessor("type", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2.5 px-px !font-medium">
            Type
          </Text>
        ),
        meta: { width: "125px" },
      }),
      tableColumnHelper.accessor("card", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-[11px] px-px !font-medium">
            Card
          </Text>
        ),
        meta: { width: "134px" },
      }),
      tableColumnHelper.accessor("date", {
        cell: (info) => (
          <Text as="p" className="!text-gray-900">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-[11px] px-px !font-medium">
            Date
          </Text>
        ),
        meta: { width: "198px" },
      }),
      tableColumnHelper.accessor("amount", {
        cell: (info) => (
          <Text as="p" className="!text-pink-A200 !font-medium">
            {info?.getValue?.()}
          </Text>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-[11px] px-px !font-medium">
            Amount
          </Text>
        ),
        meta: { width: "110px" },
      }),
      tableColumnHelper.accessor("receipt", {
        cell: (info) => (
          <div className="h-[65px] md:w-full flex-1 relative md:flex-none">
            <Text
              size="lg"
              as="p"
              className="w-max ml-[15px] left-[12%] bottom-0 top-0 my-auto !text-indigo-900 absolute"
            >
              {info?.getValue?.()}
            </Text>
            <div className="h-[35px] w-[87%] left-0 bottom-0 top-0 my-auto border-indigo-900 border border-solid absolute rounded-[17px]" />
          </div>
        ),
        header: (info) => (
          <Text as="p" className="pt-px pb-2.5 px-px !font-medium">
            Receipt
          </Text>
        ),
        meta: { width: "130px" },
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
                    alignSelf: "start",
                    color: "#b1b1b1",
                    fontWeight: 500,
                    fontSize: "18px",
                    paddingTop: "19px",
                    paddingBottom: "19px",
                    [`&:hover, &.ps-active`]: { color: "#1814f3" },
                  },
                }}
                rootStyles={{ ["&>ul"]: { gap: "0.19px" } }}
                className="flex flex-col self-stretch items-end w-full mb-[425px] px-1"
              >
                <MenuItem
                  icon={
                    <Img src="images/img_vector_gray_400_25x25.svg" alt="vector_one" className="h-[25px] w-[25px]" />
                  }
                >
                  Dashboard
                </MenuItem>
                <MenuItem
                  icon={<Img src="images/img_glyph_indigo_a700.svg" alt="glyph_one" className="h-[25px] w-[25px]" />}
                >
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
            <div className="p-[26px] sm:p-5 bg-gray-100 flex-1">
              <div className="flex flex-col items-center">
                <div className="flex justify-between w-[80%] md:w-full gap-5">
                  <Heading as="h1">My Cards</Heading>
                  <div className="flex justify-center items-start gap-[30px]">
                    <Heading size="xs" as="h2" className="mt-0.5">
                      + Add Card
                    </Heading>
                    <Heading as="h3">My Expense</Heading>
                  </div>
                </div>
                <div className="flex md:flex-col self-stretch justify-center mt-[17px] gap-[30px]">
                  <div className="flex md:flex-col gap-[30px] flex-1">
                    <div className="flex justify-center w-full pt-6 sm:pt-5 bg-gradient1 rounded-[25px]">
                      <div className="flex flex-col items-center w-full gap-7">
                        <div className="flex justify-between items-center w-[86%] md:w-full gap-5">
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
                            alt="balance_two"
                            className="self-start w-[34px] object-cover"
                          />
                        </div>
                        <div className="flex justify-between w-[65%] md:w-full gap-5">
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
                        <div className="self-stretch p-5 rounded-bl-[25px] rounded-br-[25px] bg-gradient">
                          <div className="flex justify-between items-center gap-5">
                            <Text size="5xl" as="p" className="self-end !text-white-A700 !font-lato">
                              3778 **** **** 1234
                            </Text>
                            <Img src="images/img_group_17.svg" alt="image" className="h-[30px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center w-full pt-6 sm:pt-5 border-teal-50 border border-solid bg-white-A700 rounded-[25px]">
                      <div className="flex flex-col items-center w-full gap-7">
                        <div className="flex justify-between items-center w-[86%] md:w-full gap-5">
                          <div className="flex flex-col items-start">
                            <Text size="xs" as="p" className="!font-lato">
                              Balance
                            </Text>
                            <Text size="4xl" as="p" className="!text-blue_gray-800_01 !font-lato">
                              $5,756
                            </Text>
                          </div>
                          <Img
                            src="images/img_chip_card.png"
                            alt="chipcard_one"
                            className="self-start w-[34px] object-cover"
                          />
                        </div>
                        <div className="flex justify-between w-[65%] md:w-full gap-5">
                          <div className="flex flex-col items-start gap-0.5">
                            <Text size="xs" as="p" className="!font-lato">
                              CARD HOLDER
                            </Text>
                            <Text size="lg" as="p" className="self-center !text-blue_gray-800_01 !font-lato !font-thin">
                              Eddy Cusuma
                            </Text>
                          </div>
                          <div className="flex flex-col items-start gap-0.5">
                            <Text size="xs" as="p" className="!font-lato">
                              VALID THRU
                            </Text>
                            <Text size="lg" as="p" className="!text-blue_gray-800_01 !font-lato !font-thin">
                              12/22
                            </Text>
                          </div>
                        </div>
                        <div className="flex self-stretch justify-between items-center gap-5 p-5 rounded-bl-[25px] rounded-br-[25px] border-teal-50_01 border border-solid">
                          <Text size="5xl" as="p" className="self-end !text-blue_gray-800_01 !font-lato">
                            3778 **** **** 1234
                          </Text>
                          <Img src="images/img_group_17_blue_gray_300.svg" alt="image" className="h-[30px] mr-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center w-[32%] md:w-full p-[23px] sm:p-5 bg-white-A700 rounded-[25px]">
                    <div className="w-full">
                      <div className="flex flex-col gap-[9px]">
                        <div className="flex justify-center items-end gap-[15px]">
                          <div className="h-[93px] bg-blue_gray-50_03 flex-1 rounded-[10px]" />
                          <div className="h-[142px] bg-blue_gray-50 flex-1 rounded-[10px]" />
                          <div className="h-[96px] bg-blue_gray-50 flex-1 rounded-[10px]" />
                          <div className="flex flex-col items-center w-[50%] gap-[5px]">
                            <Text size="md" as="p" className="!text-blue_gray-800_01 text-center !font-medium">
                              $12,500
                            </Text>
                            <div className="flex self-stretch justify-center items-end gap-[15px]">
                              <div className="h-[49px] w-full bg-blue_gray-50 rounded-[10px]" />
                              <div className="h-[129px] w-full bg-teal-A400_01 shadow-sm rounded-[10px]" />
                              <div className="h-[88px] w-full bg-blue_gray-50 rounded-[10px]" />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between gap-5">
                          <Text size="s" as="p" className="self-end text-center">
                            Aug
                          </Text>
                          <Text size="s" as="p" className="self-end text-center">
                            Sep
                          </Text>
                          <Text size="s" as="p" className="self-start text-center">
                            Oct
                          </Text>
                          <Text size="s" as="p" className="self-start text-center">
                            Nov
                          </Text>
                          <Text size="s" as="p" className="self-start text-center">
                            Dec
                          </Text>
                          <Text size="s" as="p" className="self-start text-center">
                            Jan
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Heading as="h4" className="self-start mt-6">
                  Recent Transactions
                </Heading>
                <div className="self-stretch mt-[25px]">
                  <div className="flex flex-col">
                    <div className="flex justify-between w-[37%] md:w-full ml-[11px] gap-5">
                      <Text as="p" className="self-start !text-indigo-A700 !font-medium">
                        All Transactions
                      </Text>
                      <Text as="p" className="self-start !font-medium">
                        Income
                      </Text>
                      <Text as="p" className="self-end !font-medium">
                        Expense
                      </Text>
                    </div>
                    <div className="h-[3px] w-[13%] mt-1.5 rounded-tl-[10px] rounded-tr-[10px] z-[1] bg-indigo-A700" />
                    <div className="h-px mt-[-1px] bg-blue_gray-50_01" />
                  </div>
                </div>
                <div className="self-stretch mt-[25px] pt-[21px] sm:pt-5">
                  <ReactTable
                    size="sm"
                    bodyProps={{ className: "" }}
                    headerProps={{ className: "md:flex-col" }}
                    rowDataProps={{ className: "md:flex-col" }}
                    className="w-[1110px] bg-white-A700 rounded-[25px]"
                    columns={tableColumns}
                    data={tableData}
                  />
                </div>
                <div className="flex justify-end items-center w-[27%] md:w-full mt-[30px]">
                  <div className="flex justify-end items-center gap-[7px]">
                    <Img src="images/img_vector_2.svg" alt="vectortwo_one" className="self-end h-[12px]" />
                    <Text size="lg" as="p" className="!text-indigo-A700 !font-medium">
                      Previous
                    </Text>
                  </div>
                  <Button color="indigo_A700" size="sm" className="w-full ml-3 font-medium rounded-[10px]">
                    1
                  </Button>
                  <Text size="lg" as="p" className="ml-[11px] !text-indigo-A700 !font-medium">
                    2
                  </Text>
                  <Text size="lg" as="p" className="ml-[27px] !text-indigo-A700 !font-medium">
                    3
                  </Text>
                  <Text size="lg" as="p" className="ml-[27px] !text-indigo-A700 !font-medium">
                    4
                  </Text>
                  <div className="flex justify-end items-center ml-7 gap-[7px]">
                    <Text size="lg" as="p" className="!text-indigo-A700 !font-medium">
                      Next
                    </Text>
                    <Img src="images/img_vector_2_indigo_a700.svg" alt="vectortwo_three" className="h-[12px]" />
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
