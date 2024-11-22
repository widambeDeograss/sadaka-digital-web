import  {useState} from 'react'
import { useQuery } from '@tanstack/react-query';
import { Button, Card , Table} from 'antd';
import Tabletop from '../../components/tables/TableTop';
import {  fetchSps } from '../../helpers/ApiConnectors.js';
import ServiceProviderModal from './AddSp.js';


function SpList() {
    const [openMOdal, setopenMOdal] = useState(false);

    const {
        data: sps,
        isLoading,

      } = useQuery({
        queryKey: ["sps"],
        queryFn: async () => {
          const response:any = await fetchSps();
          console.log(response);
          return response;
        },
        // {
        //   enabled: false,
        // }
      });
  

    const columns = [
        {
            title: "s/No",
            dataIndex: "sNo",
            render: (_text:any, _record:any, index:number) => <div >{index + 1}</div>,
            // sorter: (a, b) => a.sNo.length - b.sNo.length,
        },
        {
            title: "Name",
            dataIndex: "church_name",
            render: (text:any, _record:any) => <div>{text}</div>,
            // sorter: (a, b) => a.name.length - b.name.length,
        },
        {

            title: "Descriprion",
            dataIndex: "church_category",
            render: (text:any, _record:any) => <div>{text?.split('_')}</div>,
            // sorter: (a, b) => a.capacity.length - b.capacity.length,
        },
        {

            title: "Descriprion",
            dataIndex: "church_location",
            render: (text:any, _record:any) => <div>{text?.split('_')}</div>,
            // sorter: (a, b) => a.capacity.length - b.capacity.length,
        },
        {

            title: "Descriprion",
            dataIndex: "church_email",
            render: (text:any, _record:any) => <div>{text?.split('_')}</div>,
            // sorter: (a, b) => a.capacity.length - b.capacity.length,
        },
        {

            title: "Descriprion",
            dataIndex: "church_phone",
            render: (text:any, _record:any) => <div>{text?.split('_')}</div>,
            // sorter: (a, b) => a.capacity.length - b.capacity.length,
        },
        {
            title: <strong>Status</strong>,
            dataIndex: "church_status",
            render: (text: any, _record: any) => (
              <>
                {text === true && (
                  <span className="bg-green-300 rounded-lg p-1 text-white">Active</span>
                )}
                {text === false && (
                  <span className="bg-red-300 rounded-lg p-1 text-white">Disabled</span>
                )}
              </>
            ),
          },


          
    // {
    //     title: "",
    //     dataIndex: "is_main_branch",
    //     render: (text: any, record: any) => (
    //       <Dropdown
    //         overlay={
    //           <Menu>
    //             {GlobalMethod.hasAnyPermission(
    //               ["MANAGE_USER", "VIEW_USER"],
    //               GlobalMethod.getUserPermissionName(userPermissions)
    //             ) && (
    //               <Menu.Item
    //                 onClick={() =>
    //                   navigate("/usersManagement/viewUser", { state: { record } })
    //                 }
    //               >
    //                 View
    //               </Menu.Item>
    //             )}
    //             {GlobalMethod.hasAnyPermission(
    //               ["MANAGE_USER", "EDIT_USER"],
    //               GlobalMethod.getUserPermissionName(userPermissions)
    //             ) && (
    //               <Menu.Item
    //                 onClick={() =>
    //                   navigate("/usersManagement/editUser", { state: { record } })
    //                 }
    //               >
    //                 Edit
    //               </Menu.Item>
    //             )}
    //             {GlobalMethod.hasAnyPermission(
    //               ["MANAGE_USER", "EDIT_USER"],
    //               GlobalMethod.getUserPermissionName(userPermissions)
    //             ) && (
    //               <Menu.Item onClick={() => handleActivateDeactivate(record)}>
    //                 {record.status === "DISABLED"
    //                   ? "Activate User"
    //                   : "Deactivate User"}
    //               </Menu.Item>
    //             )}
  
    //             {GlobalMethod.hasAnyPermission(
    //               ["CHANGE_USER_PASSWORDS"],
    //               GlobalMethod.getUserPermissionName(userPermissions)
    //             ) && (
    //               <Menu.Item
    //                 onClick={() => handleChangePassword(record)}
    //                 data-bs-toggle="modal"
    //                 data-bs-target="#resetPassword"
    //               >
    //                 Change Password
    //               </Menu.Item>
    //             )}
    //           </Menu>
    //         }
    //       >
    //         <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
    //           Actions <DownOutlined />
    //         </a>
    //       </Dropdown>
    //     ),
    //   },

    ];


    return (
        <div className="max-h-max">
        <Card
          title={<h3 className=" text-sm text-left"> Service providers </h3>}
          className="mt-5"
          extra={
              <Button onClick={()=>  setopenMOdal(true)}>
               Add sp
              </Button>
          }
        >
            <div className="table-responsive">
          <Tabletop inputfilter={false} togglefilter={function (_value: boolean): void {
              throw new Error("Function not implemented.");
            } } searchTerm={''} onSearch={function (_value: string): void {
              throw new Error('Function not implemented.');
            } } data={sps}/>
        
            <Table columns={columns} dataSource={sps} loading={isLoading}/>
          </div>
        </Card>

        <ServiceProviderModal openMOdal={openMOdal} handleCancel={() =>  setopenMOdal(false)}/>
      </div>
    )
}

export default SpList
