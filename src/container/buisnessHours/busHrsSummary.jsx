import React, { Component } from "react";
import ZTable from "../../component/ZTable/ztable";
import { AppNavigation } from "../../navigations/appNavigation";
import { labelRoutes } from "../../navigations/labelRoutes";
import { ApiUrl } from "../../utils/api/apiUrl";
import { Labels } from "../../utils/constants/labels";
import { PostApi } from "../../utils/api/networking";
import "../../App.css";
import ZDialogueBox from "../../component/ZDialogueBox/zdialogueBox";
import { isSuccess } from "../../utils/commonFunction/common";
import { getBusHrsColumns } from "./busHrsColumns";
import ZToasterMsg from "../../component/ZToasterMessage/ztoasterMessage";

class BusHrsSummary extends Component {
    state = {
        summaryData: [],
        activeDialog: false,
        deleteDialog: false,
        active: "",
        businessHoursId: "",
        
        toast: {
            open: false,
            message: "",
            severity: Labels.success,
            duration: Labels.num_3000,
            position: { vertical: Labels.bottom, horizontal: Labels.center },
        },
    };

    componentDidMount = () => {
        this.pageLoadSummary();
    }

    apiCall = async (data) => {
        try {
            const res = await PostApi(ApiUrl.buisnessForm.buisnessForm_Crud, data);
            return res;
        } catch (err) {
            console.error("API call failed:", err);
            return null;
        }
    };

    showToast = (message, severity = Labels.res.success, duration = Labels.num_1000, position = { vertical: Labels.bottom, horizontal: Labels.right }) => {
        this.setState({ toast: { open: true, message, severity, duration, position } });
        setTimeout(() => this.setState((prev) => ({ toast: { ...prev.toast, open: false } })), duration);
    };

pageLoadSummary =async () => {
        const res = await this.apiCall({ flag: Labels.flag.select });
        if (res?.status === Labels.res.status) {
            this.setState({ summaryData: res.data.table0 });
        }
    };

    handleEdit = async (row) => {
        const res = await this.apiCall({ flag: Labels.flag.edit, businessHoursId: row.BusinessHoursId });
        if (isSuccess(res)) {
            this.props.navigate(labelRoutes.busHrsForm, {
                state: {
                    businessHour: res.data.table0[0] || {},
                    businessField: res.data.table1[0],
                    update: true,
                },
            });
        }
    };

    handleDelete = (row) => {
        this.setState({
            [row.IsActive ? "deleteDialog" : "activeDialog"]: true,
            active: row.IsActive,
            businessHoursId: row.BusinessHoursId,
        });
    };
    handleDeleteClick = async () => {
        const { businessHoursId, active } = this.state;
        const res = await this.apiCall({
            flag: Labels.flag.delete,
            businessHoursId,
            isActive: active ? false : true,
        });

        if (res?.status === Labels.res.status) {
            this.showToast(res.message);
            this.setState({ activeDialog: false, deleteDialog: false, businessHoursId: "", active: "" });
            this.pageLoadSummary();
        }
    };

    closeDialog = () => this.setState({ deleteDialog: false, activeDialog: false });

    render() {
        const { summaryData, deleteDialog, activeDialog, toast } = this.state;
        const columns = getBusHrsColumns(this.handleEdit, this.handleDelete);

        return (
            <>
                <ZTable
                    columns={columns}
                    rows={summaryData}
                    headerLabel={Labels.businessHours}
                    onHandleAdd={() => this.props.navigate(labelRoutes.busHrsForm)}
                />
                <ZDialogueBox
                    open={deleteDialog}
                    onClose={this.closeDialog}
                    title={Labels.makeInactive}
                    labelText={Labels.makeInactiveNote}
                    confirmText={Labels.yes}
                    cancelText={Labels.no}
                    onConfirm={this.handleDeleteClick}
                />
                <ZDialogueBox
                    open={activeDialog}
                    onClose={this.closeDialog}
                    title={Labels.makeActive}
                    labelText={Labels.makeActiveNote}
                    confirmText={Labels.yes}
                    cancelText={Labels.no}
                    onConfirm={this.handleDeleteClick}
                />
                <ZToasterMsg {...toast} onClose={() => this.setState({ toast: { ...toast, open: false } })} />
            </>
        );
    }
}

export default AppNavigation(BusHrsSummary);
