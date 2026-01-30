import React, { Component } from "react";
import { AppNavigation } from "../../navigations/appNavigation";
import ZTextEditor from "../../container/templateGroup/zTextEditor"; // assuming you already have this
import ZButton from "../../component/ZButton/zbutton";
import { FiArrowLeft } from "react-icons/fi";

class TicketReply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      priority: props.location?.state?.priority || "High",
      lastUpdated: props.location?.state?.lastUpdated || "-",
      raisedBy: props.location?.state?.raisedBy || "-",
      source: props.location?.state?.source || "-",
    };
  }

  render() {
    const { priority, lastUpdated, raisedBy, source } = this.state;

    return (
      <div className="ticket-reply-container p-6">
        {/* Header */}
         <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Reply - #{this.props.location?.state?.ticketId || "TC-XX"}{" "}
          {this.props.location?.state?.subject || "Ticket"}
        </h2>
        <FiArrowLeft
                          className="ticket-reply-back-icon"
                          onClick={() => this.props.navigate(-1)}
                        />
          </div>
        {/* Ticket Info */}
        <div className="bg-white shadow rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <p className="text-gray-500 text-sm">Priority</p>
            <span className="px-3 py-1 text-sm font-medium bg-yellow-200 text-yellow-800 rounded-full">
              {priority}
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Last Updated</p>
            <p className="font-medium">{lastUpdated}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Origin</p>
            <p className="font-medium">{source}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Raised By</p>
            <p className="font-medium">{raisedBy}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <ZButton className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Select from template...
          </ZButton>
          <ZButton className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700">
            Generate AI Draft
          </ZButton>
          <ZButton
            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg shadow cursor-not-allowed"
            disabled
          >
            Tune Up
          </ZButton>
        </div>

        {/* Text Editor */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <ZTextEditor placeholder="Type your reply here..." />
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <ZButton className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700">
            Send
          </ZButton>
        </div>
      </div>
    );
  }
}

export default AppNavigation(TicketReply);
