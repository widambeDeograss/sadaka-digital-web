import React, {useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { Button, Card , Table} from 'antd';
import Tabletop from '../../components/tables/TableTop';
import { fetchRoles } from '../../helpers/ApiConnectors.js';


function RolesList() {
    
  const navigate = useNavigate();

    const {
        data: roles,
        isLoading,
        error,
      } = useQuery({
        queryKey: ["roles"],
        queryFn: async () => {
          const response:any = await fetchRoles();
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
            render: (text:any, record:any, index:number) => <div >{index + 1}</div>,
            // sorter: (a, b) => a.sNo.length - b.sNo.length,
        },
        {
            title: "Name",
            dataIndex: "role_name",
            render: (text:any, record:any) => <div>{text}</div>,
            // sorter: (a, b) => a.name.length - b.name.length,
        },
        {

            title: "Descriprion",
            dataIndex: "role_name",
            render: (text:any, record:any) => <div>{text?.split('_')}</div>,
            // sorter: (a, b) => a.capacity.length - b.capacity.length,
        },

    ];


    return (
        <div className="max-h-max">
        <Card
          title={<h3 className=" text-sm text-left">Roles </h3>}
          className="mt-5"
          extra={
              <Button>
                  Add Role
              </Button>
          }
        >
          <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
                    throw new Error("Function not implemented.");
                } }/>
          <div className="table-responsive">
            <Table columns={columns} dataSource={roles} loading={isLoading}/>
          </div>
        </Card>
      </div>
    )
}

export default RolesList