using System;
using System.Collections.Generic;
using System.Text;
using DataAccess.Enums;

namespace DataAccess.UtilModels
{
    public class ServiceResponse
    {
        public object  Data { get; set; }
        public int Code { get; set; }
        public string Message { get; set; }
        public string SystemMessage { get; set; }
        public ServiceResponse()
        {
        }
        public ServiceResponse OnSuccess(object data, string message = "Successfull")
        {
            this.Data = data;
            this.Code = (int) ResponseCode.Success;
            this.Message = message;
            return this;
        }
        public ServiceResponse OnError( string message = "Có lỗi xảy ra", int subcode = (int)ResponseCode.SomeError)
        {
            this.Data = null;
            this.Code = subcode;
            this.Message = message;
            return this;
        }
        public ServiceResponse OnExeption(Exception ex)
        {
            this.Data = null;
            this.Code = (int) ResponseCode.SystemError;
            this.Message = ex.Message;
            return this;
        }
    }
}
