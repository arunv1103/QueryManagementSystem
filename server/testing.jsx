

import { Button } from '@mui/material'
import React from 'react'
import {  PostApi } from '../src/utils/api/networking'
import { Labels } from '../src/utils/constants/labels'
import { Ticket_Api } from '../src/utils/api/apiUrl'

const Testing = () => {

    const handleClick = async () => {
        const emailRes = await PostApi("http://localhost:5000/emails",{clientEmail:"akshayaarul1310@gmail.com"})
        console.log(emailRes, "res")
        if (emailRes.status == Labels.res.status) {
            const payload = {
                Flag: Labels.flag.insert,
                Summary: emailRes.data[0].body,
                PriorityID: 2,
                SeverityID: 2,
                Description: emailRes.data[0].subject,
                CreatedBy: 1,
                UserId: 1,
                StatusID: 1,
                DepartmentId: 1,
                ModifiedBy: 1,
                TicketID: null,
                TargetDate: null,
                FileSource: null,
                FileName: ''
            };
            const ticketRes = await PostApi(Ticket_Api.AddUpdateTickets, payload);
            console.log(ticketRes)
            // if (ticketRes.data.table0[0].Status === Labels.flag.select) {
            // } else {
            // }
        }

    }

    return (
        <div>
            <Button onClick={handleClick}>Click Me</Button>
        </div>
    )
}

export default Testing
