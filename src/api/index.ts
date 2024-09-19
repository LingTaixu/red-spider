/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "../utils/request";
/**
 * AddressItem，参数
 */
export interface AddressItem {
  /**
   * 地址
   */
  address: string;
}

/**
 * HashMsgRequest
 */
export interface Request {
  data: AddressItem;
}

/**
 * SignVerifyRequest
 */
export interface fetchAddressToTokenParams {
  data: SignVerifyItem;
}

/**
 * SignVerifyItem，签名参数
 */
export interface SignVerifyItem {
  /**
   * 地址
   */
  address: string;
  /**
   * 签名参数
   */
  signed: string;
}

export function fetchAddressToToken(
  params: fetchAddressToTokenParams
): Promise<any> {
  return request({
    url: "/chat/user/signVerify",
    method: "post",
    data: params
  });
}

// hbcERC20代币列表
export function HBCERC20() {
  return request<any>({
    url: "/chat/symbol/hbcList",
    method: "POST"
  });
}

// 销毁信息
export function getDestroyAPI() {
  return request<any>({
    url: "/Spider/config/getDestroy",
    method: "POST"
  });
}
// 汇率信息
export function rateAPI(data: any) {
  return request<any>({
    url: "/Spider/config/rate",
    method: "POST",
    data
  });
}
/**
 * NoahOwnerDetailRequest
 */
export interface getParentAPIRequest {
  condition?: { [key: string]: any };
  search: NoahOwnerSearch;
}

export interface Response {
  /**
   * 错误码
   */
  code?: number;
  data?: NoahOwnerParentResponse;
  /**
   * 错误信息
   */
  msg?: string;
}

/**
 * NoahOwnerParentResponse
 */
export interface NoahOwnerParentResponse {
  /**
   * 父级
   */
  parent?: string;
}

/**
 * NoahOwnerSearch，搜索参数
 */
export interface NoahOwnerSearch {
  /**
   * 用户等级ID
   */
  owner: string;
}
// 获取上级地址
export function getParentAPI(data: getParentAPIRequest): Promise<Response> {
  return request<any>({
    url: "/Spider/owner/getParent",
    method: "POST",
    data
  });
}
// 获取枚举
export function constantEnumAPI() {
  return request<any>({
    url: "/Spider/order/constant/enums",
    method: "POST"
  });
}

/**
 * NoahOrderListRequest
 */
export interface orderRequest {
  condition?: { [key: string]: any };
  page?: Page;
  search?: { [key: string]: any };
  sort?: any;
}

/**
 * Page，分页参数
 */
export interface Page {
  all?: number;
  page?: number;
  pageSize?: number;
  total?: number;
}

// 奖励列表
export function orderAPI(data: orderRequest) {
  return request<any>({
    url: "/Spider/order/list",
    method: "POST",
    data
  });
}
// rewardList
export function rewardAPI(data: orderRequest) {
  return request<any>({
    url: "/Spider/reward/log/list",
    method: "POST",
    data
  });
}

/**
 * SpiderOrderCheckHashRequest
 */
export interface hashPushRequest {
  condition?: { [key: string]: any };
  data: CheckHash;
  [property: string]: any;
}

/**
 * CheckHash，请求参数
 */
export interface CheckHash {
  /**
   * hash
   */
  hash: string;
  [property: string]: any;
}

export function hashPush(data: hashPushRequest) {
  return request<any>({
    url: "/Spider/order/pushHash",
    method: "POST",
    data
  });
}

export function ownerDetail(data: any) {
  return request<any>({
    url: "/Spider/owner/detail",
    method: "POST",
    data
  });
}
export function lighthouse(data: any) {
  return request<any>({
    url: "/Spider/lighthouse/list",
    method: "POST",
    data
  });
}
export function getNotifyAPI() {
  return request<any>({
    url: "/Spider/text/getNotify",
    method: "POST"
  });
}

export function getRedEnvelopeAPI(data: any) {
  return request<any>({
    url: "/spider/red/envelope/getRedEnvelope",
    method: "POST",
    data
  });
}

export function getAirdropAPI(data: any) {
  return request<any>({
    url: "/spider/airdrop/getAirdrop",
    method: "POST",
    data
  });
}

// 領取紅包

export function claimRedEnvelope(data: any) {
  return request<any>({
    url: "/spider/red/envelope/claim",
    method: "POST",
    data
  });
}

// 領取空投
export function claimAirdropAPI(data: any) {
  return request<any>({
    url: "/spider/airdrop/claimAirdrop",
    method: "POST",
    data
  });
}
