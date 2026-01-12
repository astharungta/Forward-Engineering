# ExtendedWarranty Application - Complete Business Rules, Validations & Default Values

## Document Information
- **Application**: ExtendedWarranty
- **Source**: CAST MCP Server (Imaging) + Oracle Forms XML Analysis
- **Module**: GM_EWARR_SALE (gm_ewarr_sale.xml)
- **Technology**: Oracle Forms 12c with PL/SQL
- **Total Fields**: 197 DataBlock Items
- **Data Blocks**: 4 (CB_VT_EWARR_SALE, B_VT_EWARR_SALE, B_EW_DOCS, B_ADDON)
- **Generated**: January 8, 2026
- **Database**: Oracle Database with MWAR_EXTE, GM_VIN, GM_CIN, VM_EW_PARAM, GM_VAR tables

---

## Table of Contents
1. [Control Block Fields (CB_VT_EWARR_SALE)](#control-block-fields)
2. [Main Transaction Block Fields (B_VT_EWARR_SALE)](#main-transaction-block-fields)
3. [Document Block Fields (B_EW_DOCS)](#document-block-fields)
4. [CCP Add-on Block Fields (B_ADDON)](#ccp-add-on-block-fields)
5. [Default Values Summary](#default-values-summary)
6. [Validation Triggers Summary](#validation-triggers-summary)

---

## Control Block Fields (CB_VT_EWARR_SALE)

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **NB_EWARR_NUM** | VARCHAR2 | 12 | Yes | None | None | • Upper case only<br>• Must exist in MWAR_EXTE table<br>• Error: "Contract Number Not Found" if invalid | • Fetches entire contract from database (60+ fields)<br>• Validates vehicle registration in GM_VIN<br>• Retrieves loyalty and CCP details<br>• Disables all editing for existing contracts<br>• Determines warranty type (OLD/NEW) | No | WHEN-VALIDATE-ITEM (ID: 585, 398 lines) |
| **PAY_MODE** | VARCHAR2 | 50 | Yes | 'C' (Cash) | None | • Cannot be NULL<br>• Error: "Please select payment mode..." | • Controls OTP button enable/disable<br>• Enables loyalty redemption (except 'O' online mode) | Dynamic: C=Cash, O=Online, etc. | WHEN-VALIDATE-ITEM (ID: 583) |
| **TOTAL_PREMIUM** | NUMBER | - | No | 0 | 0 | • Display only (calculated)<br>• Format: 99999999999.99 | **Formula**: EXTE_PREMIUM_CALCULATED + EXTE_PREM_CGST_AMT + EXTE_PREM_SGST_AMT + EXTE_PREM_IGST_AMT + EXTE_ADDON_TOT_AMT - LOYL_REDEEM_AMT | No | None (calculated field) |
| **STATUS** | VARCHAR2 | 20 | No | None | None | • Display only<br>• Red foreground color | • Shows contract status: Active/Cancelled<br>• Based on EXTE_CANCEL_FLAG value | No | None |

---

## Main Transaction Block Fields (B_VT_EWARR_SALE)

### Policy and Warranty Information

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_POLICY_NO** | VARCHAR2 | 12 | Yes | Auto-generated | None | • Primary key<br>• Unique identifier | Policy number for extended warranty contract | No | None |
| **EXTE_CONTRACT_DATE** | DATE | - | No | SYSDATE | SYSDATE | • Auto-populated<br>• Disabled (cannot edit)<br>• Format: DD-MM-RRRR HH24:MI | System date at contract creation | No | None |
| **EXTE_WARR_TYPE** | VARCHAR2 | 3 | Yes | None | None | • Mandatory<br>• Must exist in VM_EW_PARAM<br>• NEXA vehicle validation<br>• Commercial vehicle validation | • Retrieves warranty validity via PKG_EXTE_WAR.SP_EW_DETAILS<br>• Gets GST state, SAC code from VM_EW_PARAM<br>• Determines GST type (State/Interstate) | VM_EW_PARAM (filtered by date) | WHEN-VALIDATE-ITEM (ID: 594) |
| **NB_EXTE_WARR_TYPE_OLD** | VARCHAR2 | 3 | Conditional | None | None | • Mandatory for OLD warranty<br>• Visible if retail date < EWR_CHANGE_DATE<br>• NEXA/Commercial checks | • Validates warranty type for pre-change vehicles<br>• Retrieves parameters via SP_EW_DETAILS | AM_LIST (Warranty Type Old) | WHEN-VALIDATE-ITEM (ID: 588, 50 lines) |
| **NB_EXTE_WARR_TYPE_NEW** | VARCHAR2 | 3 | Conditional | None | None | • Mandatory for NEW warranty<br>• Visible if retail date >= EWR_CHANGE_DATE<br>• NEXA/Commercial checks | • Validates warranty type for post-change vehicles<br>• Retrieves parameters via SP_EW_DETAILS | AM_LIST (Warranty Type New) | WHEN-VALIDATE-ITEM (ID: 590) |
| **EXTE_VALID_DATE** | DATE | - | Yes | Calculated | None | • Mandatory<br>• Must be >= SYSDATE<br>• Format: DD-MM-RRRR | • Calculated from warranty type + contract date<br>• Retrieved via PKG_EXTE_WAR.SP_EW_DETAILS | No | WHEN-VALIDATE-ITEM (ID: 596) |
| **EXTE_VALID_MILEAGE** | NUMBER | 6 | Yes | **40,000 km (OLD)<br>100,000 km (NEW)** | None | • Mandatory<br>• Maximum warranty coverage mileage | **DEFAULT SOURCE**: Database-driven from GM_VAR table<br>**Query Logic**:<br>```sql<br>CASE WHEN NB_EWR_TYPE='O' THEN<br>  NVL(gm.svar_warr_kms, 40000)<br>WHEN NB_EWR_TYPE='N' THEN<br>  NVL(gm.svar_warr_kms_new, 100000)<br>ELSE NVL(gm.svar_warr_kms, 40000)<br>END<br>```<br>• Retrieved during VIN validation<br>• Configurable per principal (dealer) | No | VIN.WHEN-VALIDATE-ITEM (line 49 in XML) |
| **EXTE_START_DATE** | DATE | - | No | Calculated | None | • Display only<br>• Format: DD-MM-RRRR | Warranty start date (typically contract date) | No | None |
| **EXTE_BOOKLET_NO** | VARCHAR2 | 12 | No | None | None | • Optional text field | Physical warranty booklet identification | No | None |
| **EXTE_FREE_FLAG** | VARCHAR2 | 1 | No | 'N' | 'N' | • Display only<br>• Y/N values | **Logic**: Y if (invoice_date <= free_booking_date AND variant in EW_DISC_PRICE range)<br>• Determined during VIN validation | Y/N | VIN.WHEN-VALIDATE-ITEM |

### Vehicle Information

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **VIN** | VARCHAR2 | 25 | Yes | None | None | • Mandatory<br>• Upper case<br>• 17-25 characters<br>• OEM VIN format validation | **MOST COMPLEX TRIGGER** (546 lines):<br>• Validates via sp_validate_oemvin<br>• Warranty eligibility via PKG_EXTE_WAR.SP_EW_VIN_VALIDATE<br>• Populates 40+ fields (vehicle, customer, GST, loyalty, CCP)<br>• Address validation (min 3 chars)<br>• GST number format validation<br>• Free EW eligibility check<br>• Loyalty card lookup<br>• CCP eligibility validation | No | WHEN-VALIDATE-ITEM (ID: 586, 546 lines) |
| **EXTE_VIN_NO** | VARCHAR2 | 17 | Yes | Auto from VIN | None | • Display only<br>• First 17 chars of OEM VIN | Populated from VIN field | No | None |
| **OEM_VIN_NUMBER** | VARCHAR2 | 25 | No | Auto from VIN | None | • Display only | Complete OEM VIN from manufacturer | No | None |
| **EXTE_CHASSIS_NO** | VARCHAR2 | 7 | No | Auto from VIN | None | • Display only | Last 7 characters of VIN | No | None |
| **EXTE_ENGINE_NO** | VARCHAR2 | 7 | No | Auto from GM_VIN | None | • Display only | Retrieved from GM_VIN table | No | None |
| **EXTE_REGISTRATION_NO** | VARCHAR2 | 20 | No | Auto from GM_VIN | None | • Display only | RTO registration number | No | None |
| **EXTE_MODL_CODE** | VARCHAR2 | 5 | No | Auto from GM_VIN | None | • Display only | Vehicle model code (e.g., WB, ST, DH) | No | None |
| **EXTE_VARIANT_CD** | VARCHAR2 | 8 | No | Auto from GM_VIN | None | • Display only | Variant with transmission details | No | None |
| **EXTE_SERV_MODL** | VARCHAR2 | 50 | No | Auto from GM_VIN | None | • Display only | Service model description | No | None |
| **EXTE_RETLSALE_DT** | DATE | - | No | Auto from GM_VIN | None | • Display only<br>• Format: DD-MM-RRRR | **CRITICAL**: Determines OLD vs NEW warranty type<br>• Compared to P_EWR_CHANGE_DATE parameter | No | None |

### Mileage Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_CONTRACT_MILEAGE** | NUMBER | 6 | Yes | None | None | • Mandatory<br>• Must be >= DUMMY_MILEAGE (last service)<br>• Must be <= NB_EWR_PUR_MILEAGE (purchase limit)<br>• Cannot exceed warranty mileage limit | • Validated via stored procedure<br>• Used in document upload threshold logic<br>• CCP eligibility check (> p_ccp_mil disables CCP)<br>• Sets DUMMY_MILEAGE after validation | No | WHEN-VALIDATE-ITEM (ID: 598) |
| **DUMMY_MILEAGE** | NUMBER | 9 | No | From EXTE_CONTRACT_MILEAGE | None | • System field<br>• Reference storage | • Stores last service mileage<br>• Set to EXTE_CONTRACT_MILEAGE value during VIN validation<br>• Used as lower bound for contract mileage | No | None |
| **NB_EWR_PUR_MILEAGE** | NUMBER | 6 | No | **40,000 km (OLD)<br>100,000 km (NEW)** | None | • Display only<br>• Right justified | **DEFAULT SOURCE**: Retrieved from GM_VAR during VIN validation<br>**Query** (line 49 in XML):<br>```sql<br>SELECT CASE<br>  WHEN NB_EWR_TYPE='O' THEN<br>    NVL(gm.svar_warr_kms, 40000)<br>  WHEN NB_EWR_TYPE='N' THEN<br>    NVL(gm.svar_warr_kms_new, 100000)<br>  ELSE NVL(gm.svar_warr_kms, 40000)<br>END<br>FROM gm_var gm<br>WHERE gm.variant_cd = :exte_variant_cd<br>```<br>• Maximum odometer for warranty purchase<br>• Fallback: 40K if NULL | No | None |
| **NB_LAST_MILEAGE** | NUMBER | 6 | No | From service history | None | • Display only | Last service visit mileage from history | No | None |
| **NB_PRJ_MILEAGE** | NUMBER | 6 | No | Calculated | None | • Display only | Projected mileage at warranty expiration<br>• Via PKG_EXTE_WAR.SP_EW_PROJ_MILEAGE | No | None |

### Customer Information

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_CUST_CD** | VARCHAR2 | 10 | No | Auto from GM_CIN | None | • Auto-populated from VIN | Customer ID from GM_CIN table | No | None |
| **EXTE_CUST_NAME** | VARCHAR2 | 100 | No | Auto from GM_CIN | None | • Display, disabled<br>• Min 3 characters validated | Customer full name | No | None |
| **EXTE_CUST_ADD1** | VARCHAR2 | 200 | No | Auto from GM_CIN | None | • Display, disabled<br>• **Min 3 chars required**<br>• Validated during VIN entry | Primary address line | No | None |
| **EXTE_CUST_ADD2** | VARCHAR2 | 200 | No | Auto from GM_CIN | None | • Display, disabled<br>• **Min 3 chars required**<br>• Validated during VIN entry | Secondary address line | No | None |
| **EXTE_CUST_ADD3** | VARCHAR2 | 200 | No | Auto from GM_CIN | None | • Display, disabled | Tertiary address line | No | None |
| **EXTE_CUST_CITY** | VARCHAR2 | 30 | No | Auto from GM_CIN | None | • Display, disabled | Customer city | No | None |
| **EXTE_CUST_STATE** | VARCHAR2 | 50 | No | Auto from GM_CIN | None | • Display, disabled<br>• **MANDATORY** (error if NULL)<br>• Used for GST type determination | Customer state for GST calculation | No | None |
| **EXTE_CUST_PIN** | VARCHAR2 | 6 | No | Auto from GM_CIN | None | • Display, disabled | Postal code | No | None |
| **EXTE_CUST_EMAIL** | VARCHAR2 | 100 | No | Auto from GM_CIN | None | • Display, disabled | Email address | No | None |
| **EXTE_CUST_PHONE** | VARCHAR2 | 50 | No | Auto from GM_CIN | None | • Display, disabled | Work phone | No | None |
| **EXTE_CUST_PHONE2** | VARCHAR2 | 50 | No | Auto from GM_CIN | None | • Display, disabled | Alternate phone | No | None |
| **EXTE_CUST_MOBILE** | VARCHAR2 | 50 | No | Auto from GM_CIN | None | • Display, disabled | Mobile number | No | None |
| **CUST_GST_NUM** | VARCHAR2 | 30 | No | Auto from GM_CIN | None | • Display, disabled<br>• Format validated via pkg_einv.sp_validate_gstn | GST registration number | No | None |

### Payment Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_PREMIUM_CALCULATED** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | Base premium via PKG_EXTE_WAR (excludes GST)<br>• Based on warranty type, model, mileage | No | None |
| **EXTE_PREMIUM** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | Total premium including GST<br>• EXTE_PREMIUM_CALCULATED + GST amounts | No | None |
| **EXTE_PREMIUM_RCVD** | NUMBER | - | No | None | None | • Editable<br>• Format: 99999999999.99 | Actual amount received (can differ for partial payment) | No | None |
| **EXTE_BANK_NAME** | VARCHAR2 | 40 | No | None | None | • Upper case<br>• Required if PAY_MODE = cheque/DD | Bank name for cheque/DD payment | No | None |
| **EXTE_CHEQUE_NO** | VARCHAR2 | 12 | No | None | None | • Upper case<br>• Required if PAY_MODE = cheque/DD | Cheque or DD number | No | None |
| **EXTE_CHEQUE_DATE** | DATE | - | No | None | None | • Format: DD-MM-RRRR<br>• Required if PAY_MODE = cheque/DD | Date on cheque/DD | No | None |
| **EXTE_INFAVOUR_OF** | VARCHAR2 | 60 | No | None | None | • Upper case | Name in favor of whom cheque is drawn | No | None |

### GST/Tax Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **GST_TYPE** | VARCHAR2 | 3 | Yes | Auto-determined | None | • Mandatory<br>• Display only<br>• S/I values | **Logic**: 'S' if warranty_state = customer_state (CGST+SGST)<br>'I' if warranty_state ≠ customer_state (IGST)<br>• Auto-set during VIN/warranty type validation | S/I | None |
| **GST_STATE_CD** | VARCHAR2 | 30 | No | From VM_EW_PARAM | None | • Display only | State code for GST<br>• From VM_EW_PARAM based on warranty type | No | None |
| **SAC_CODE** | VARCHAR2 | 30 | No | From VM_EW_PARAM | None | • Display only | Service Accounting Code for GST | No | None |
| **PLACE_OF_SUPPLY** | VARCHAR2 | 30 | No | Auto from GST_STATE_CD | None | • Display only | Location for GST calculation | No | None |
| **EXTE_PREM_CGST_RATE** | NUMBER | - | No | **9%** (typical) | None | • Disabled<br>• Format: 99999999999.99 | CGST rate percentage (applied when GST_TYPE='S') | No | None |
| **EXTE_PREM_SGST_RATE** | NUMBER | - | No | **9%** (typical) | None | • Disabled<br>• Format: 99999999999.99 | SGST rate percentage (applied when GST_TYPE='S') | No | None |
| **EXTE_PREM_IGST_RATE** | NUMBER | - | No | **18%** (typical) | None | • Disabled<br>• Format: 99999999999.99 | IGST rate percentage (applied when GST_TYPE='I') | No | None |
| **EXTE_PREM_CGST_AMT** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | **Formula**: EXTE_PREMIUM_CALCULATED * EXTE_PREM_CGST_RATE / 100 | No | None |
| **EXTE_PREM_SGST_AMT** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | **Formula**: EXTE_PREMIUM_CALCULATED * EXTE_PREM_SGST_RATE / 100 | No | None |
| **EXTE_PREM_IGST_AMT** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | **Formula**: EXTE_PREMIUM_CALCULATED * EXTE_PREM_IGST_RATE / 100 | No | None |
| **EXTE_TOT_PREM_SRV_TAX** | NUMBER | - | No | 0 | 0 | • Disabled (legacy)<br>• Not used in GST regime | Legacy service tax field | No | None |
| **EXTE_TOT_PREM_SBC_TAX** | NUMBER | - | No | 0 | 0 | • Disabled (legacy)<br>• Not used in GST regime | Legacy Swachh Bharat Cess | No | None |
| **EXTE_TOT_PREM_KKC_TAX** | NUMBER | - | No | 0 | 0 | • Disabled (legacy)<br>• Not used in GST regime | Legacy Krishi Kalyan Cess | No | None |

### Commission Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_PREM_DLR_COMM** | NUMBER | - | No | 0 | 0 | • Disabled, calculated<br>• Format: 99999999999.99 | Dealer commission on warranty sale<br>• Based on commission % parameter | No | None |
| **COMM_CGST_RATE** | NUMBER | - | No | From parameters | None | • Disabled | CGST rate on dealer commission (GST_TYPE='S') | No | None |
| **COMM_SGST_RATE** | NUMBER | - | No | From parameters | None | • Disabled | SGST rate on dealer commission (GST_TYPE='S') | No | None |
| **COMM_IGST_RATE** | NUMBER | - | No | From parameters | None | • Disabled | IGST rate on dealer commission (GST_TYPE='I') | No | None |
| **EXTE_PREM_COMM_CGST** | NUMBER | - | No | 0 | 0 | • Disabled, calculated | CGST on dealer commission | No | None |
| **EXTE_PREM_COMM_SGST** | NUMBER | - | No | 0 | 0 | • Disabled, calculated | SGST on dealer commission | No | None |
| **EXTE_PREM_COMM_IGST** | NUMBER | - | No | 0 | 0 | • Disabled, calculated | IGST on dealer commission | No | None |

### Loyalty Program Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **NB_LOY_CARD_NUM** | VARCHAR2 | 20 | No | Auto from loyalty | None | • Display, disabled | Loyalty card number via PKG_LOYALTY.SP_GET_VIN_LOYALTY_DTL | No | None |
| **NB_LOY_REG_NUM** | VARCHAR2 | 20 | No | Auto from loyalty | None | • Display, disabled | Registered mobile with loyalty program | No | None |
| **NB_LOY_BAL_POINT** | NUMBER | - | No | Auto from loyalty | None | • Display, disabled | Current balance loyalty points | No | None |
| **NB_LOY_BAL_RS** | NUMBER | - | No | Auto from loyalty | None | • Display, disabled | Rupee value of available points | No | None |
| **LOYL_REDEEM_PTS** | NUMBER | - | No | 0 | 0 | • Must be >= 0<br>• Must be <= NB_LOY_BAL_POINT<br>• Error if exceeds balance<br>• Enables OTP if > 0 | Points to redeem<br>• Resets NB_LOY_OTP_VALIDATE to 'N' | No | WHEN-VALIDATE-ITEM (ID: 592) |
| **LOYL_REDEEM_AMT** | NUMBER | - | No | 0 | 0 | • Display, calculated | Rupee value of redeemed points<br>• Via PKG_LOYALTY conversion | No | None |
| **LOYL_AWARD_PTS** | NUMBER | - | No | 0 | 0 | • Display, disabled | New points awarded for this purchase | No | None |
| **OTP_CNF** | VARCHAR2 | 10 | No | None | None | • Enabled when LOYL_REDEEM_PTS > 0 | OTP code for loyalty redemption<br>• Validated via PKG_LOYALTY.SP_VALIDATE_OTP | No | None |
| **NB_LOY_OTP_VALIDATE** | VARCHAR2 | 20 | No | **'N'** | **'N'** | • Hidden field<br>• Y/N values | OTP validation flag: 'Y'=validated, 'N'=not validated<br>• Set to 'Y' after successful OTP | Y/N | None |

### Employee Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_EMP_CD** | VARCHAR2 | 8 | Yes | None | None | • Mandatory<br>• Error: "Service Advisor / DSE Cannot Be Blank"<br>• Must exist in GM_EMP<br>• Must be at current dealer/location | Validates employee code and populates name | LV_EMP (GM_EMP) | WHEN-VALIDATE-ITEM (ID: 597) |
| **NB_EMP_NAME** | VARCHAR2 | 200 | No | Auto from GM_EMP | None | • Display, disabled | Service advisor/sales executive name | No | None |

### CCP Add-on Fields (Main Block Display)

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_ADDON_POLICY_NO** | VARCHAR2 | 12 | No | From VT_ADDON | None | • Display, disabled | CCP package policy number if purchased | No | None |
| **EXTE_ADDON_BASIC_AMT** | NUMBER | - | No | 0 | 0 | • Display, disabled<br>• Format: 99999999999.99 | CCP base price (excluding GST) | No | None |
| **EXTE_ADDON_CGST_AMT** | NUMBER | - | No | 0 | 0 | • Display, disabled<br>• Format: 99999999999.99 | CGST on CCP package | No | None |
| **EXTE_ADDON_SGST_AMT** | NUMBER | - | No | 0 | 0 | • Display, disabled<br>• Format: 99999999999.99 | SGST on CCP package | No | None |
| **EXTE_ADDON_IGST_AMT** | NUMBER | - | No | 0 | 0 | • Display, disabled<br>• Format: 99999999999.99 | IGST on CCP package | No | None |
| **EXTE_ADDON_TOT_AMT** | NUMBER | - | No | 0 | 0 | • Display, disabled<br>• Format: 99999999999.99 | Total CCP amount with GST<br>• Contributes to TOTAL_PREMIUM | No | None |

### Audit Fields

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **EXTE_CREATED_BY** | VARCHAR2 | 20 | No | :GLOBAL.user_id | None | • Auto-populated<br>• System field | User ID who created contract | No | None |
| **EXTE_CREATED_DATE** | DATE | - | No | SYSDATE | SYSDATE | • Auto-populated<br>• Format: DD-MM-RRRR HH24:MI | Timestamp when contract created | No | None |

---

## Document Block Fields (B_EW_DOCS)

**Business Rule**: Minimum 4 documents required before contract submission

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **SRL_NUM** | NUMBER | - | Yes | Auto-sequence | None | • Display, primary key<br>• Auto-generated | Sequence number for documents | No | None |
| **CLIENT_PATH** | VARCHAR2 | 1000 | No | None | None | • Display | Local file path after selection | No | None |
| **DOC_SIZE** | NUMBER | - | No | Calculated | None | • Display, calculated in KB<br>• **Max 5MB (5120 KB)** | File size validation during upload | No | None |
| **REMARKS** | VARCHAR2 | 500 | Yes | None | None | • Mandatory<br>• Multiline<br>• Error: "Remarks cannot be blank" | Document type/purpose description | LOV_DOCS | WHEN-VALIDATE-ITEM (ID: 603) |
| **FILENAME** | VARCHAR2 | 100 | No | Auto from upload | None | • Auto-populated | File name with extension | No | None |
| **FILEPATH** | VARCHAR2 | 100 | No | Auto-generated | None | • Auto-populated<br>• Format: /extended_warranty/[policy]/[file] | Server storage path | No | None |
| **EXT** | VARCHAR2 | 5 | No | Auto from filename | None | • Auto-populated | File extension (pdf, jpg, png, doc) | No | None |
| **CREATED_DATE** | DATE | - | No | SYSDATE | SYSDATE | • Auto-populated<br>• Format: DD-MM-RRRR HH24:MI | Document upload timestamp | No | None |
| **CREATED_BY** | VARCHAR2 | 20 | No | :GLOBAL.user_id | None | • Auto-populated | User who uploaded document | No | None |
| **DOWNLOAD_YN** | VARCHAR2 | 1 | No | **'N'** | **'N'** | • System field<br>• Y/N values | 'Y'=document exists and downloadable<br>'N'=not available | Y/N | None |
| **DEALER_MAP_CD** | VARCHAR2 | 10 | No | Auto from main block | None | • Auto-populated | Dealer code for organization | No | None |

---

## CCP Add-on Block Fields (B_ADDON)

**Business Rule**: 13 records displayed. Customer can select one or multiple packages (E0000 "No Product" is mutually exclusive with others)

| Field Name | Data Type | Length | Mandatory | Default Value | InitialValue | Validation Rules | Business Logic | LOV/Picklist | Related Triggers |
|------------|-----------|--------|-----------|---------------|--------------|------------------|----------------|--------------|------------------|
| **ADDON_CODE** | VARCHAR2 | 7 | No | From AM_LIST | None | • Display only | Package code (E0000, E0001, etc.) | AM_LIST (ADDON_PACKAGE) | None |
| **ADDON_DESC** | VARCHAR2 | 100 | No | From AM_LIST | None | • Display only | Package description (No Product, Standard CCP, Premium CCP, Hydro Shield, Fuel Care) | No | None |
| **ADDON_BASIC_PRICE** | NUMBER | - | No | From AM_LIST | None | • Display<br>• Format: 99999999999.99 | List price before discount | No | None |
| **ADDON_DISC_AMT** | NUMBER | - | No | Calculated | 0 | • Display<br>• Format: 99999999999.99 | Discount applied on package | No | None |
| **ADDON_BASIC_AMT** | NUMBER | - | No | Calculated | 0 | • Display, calculated<br>• Format: 99999999999.99 | **Formula**: ADDON_BASIC_PRICE - ADDON_DISC_AMT<br>• Via PKG_ADDON_SALE.CALC_PREM | No | None |
| **ADDON_CGST_AMT** | NUMBER | - | No | Calculated | 0 | • Display, calculated<br>• Format: 99999999999.99 | CGST on package (when main GST_TYPE='S') | No | None |
| **ADDON_SGST_AMT** | NUMBER | - | No | Calculated | 0 | • Display, calculated<br>• Format: 99999999999.99 | SGST on package (when main GST_TYPE='S') | No | None |
| **ADDON_IGST_AMT** | NUMBER | - | No | Calculated | 0 | • Display, calculated<br>• Format: 99999999999.99 | IGST on package (when main GST_TYPE='I') | No | None |
| **ADDON_TOT_AMT** | NUMBER | - | No | Calculated | 0 | • Display, calculated<br>• Format: 99999999999.99 | **Formula**: ADDON_BASIC_AMT + GST amounts | No | None |
| **ADDON_YN** | VARCHAR2 | 1 | No | **'N'** | **'N'** | • Checkbox<br>• Y/N values<br>• **Mutual exclusivity**: E0000 vs others | • Y=selected, N=not selected<br>• E0000 "No Product" unchecks all others<br>• Other packages uncheck E0000<br>• Updates EXTE_ADDON_TOT_AMT | Y/N | WHEN-CHECKBOX-CHANGED |
| **ADDON_GST_TYPE** | VARCHAR2 | 3 | No | From main block | None | • Display<br>• Inherited from main GST_TYPE | Determines CGST/SGST vs IGST | S/I | None |
| **ADDON_CGST_RATE** | NUMBER | - | No | From parameters | None | • Display | CGST rate % for addon | No | None |
| **ADDON_SGST_RATE** | NUMBER | - | No | From parameters | None | • Display | SGST rate % for addon | No | None |
| **ADDON_IGST_RATE** | NUMBER | - | No | From parameters | None | • Display | IGST rate % for addon | No | None |

---

## Default Values Summary

### System-Generated Defaults (Auto-Populated)

| Field Name | Default Value | Source | When Applied | Configurable? |
|------------|---------------|--------|--------------|---------------|
| EXTE_CONTRACT_DATE | SYSDATE | System | At contract creation | No |
| EXTE_CREATED_DATE | SYSDATE | System | At contract creation | No |
| CREATED_DATE (docs) | SYSDATE | System | At document upload | No |
| EXTE_CREATED_BY | :GLOBAL.user_id | System | At contract creation | No |
| CREATED_BY (docs) | :GLOBAL.user_id | System | At document upload | No |
| PAY_MODE | 'C' (Cash) | System | At form initialization | No |
| TOTAL_PREMIUM | 0 | Calculated | At form initialization | No |
| EXTE_PREMIUM_CALCULATED | 0 | Calculated | Before warranty type selection | No |
| All GST amount fields | 0 | Calculated | Before premium calculation | No |
| ADDON_YN | 'N' | System | For each addon record | No |
| DOWNLOAD_YN | 'N' | System | For each document record | No |
| NB_LOY_OTP_VALIDATE | 'N' | System | At loyalty field initialization | No |
| EXTE_FREE_FLAG | 'N' | System | Before VIN validation | No |

### Database-Driven Defaults (Retrieved from DB)

| Field Name | Default Value | Source Table | Query Logic | Configurable? |
|------------|---------------|--------------|-------------|---------------|
| **EXTE_VALID_MILEAGE** | **40,000 km (OLD type)**<br>**100,000 km (NEW type)** | **GM_VAR** | ```sql<br>CASE WHEN NB_EWR_TYPE='O' THEN<br>  NVL(gm.svar_warr_kms, 40000)<br>WHEN NB_EWR_TYPE='N' THEN<br>  NVL(gm.svar_warr_kms_new, 100000)<br>ELSE NVL(gm.svar_warr_kms, 40000)<br>END<br>FROM gm_var gm<br>WHERE gm.variant_cd = :exte_variant_cd<br>``` | **Yes** (per principal/variant) |
| **NB_EWR_PUR_MILEAGE** | **40,000 km (OLD type)**<br>**100,000 km (NEW type)** | **GM_VAR** | Same query as EXTE_VALID_MILEAGE | **Yes** (per principal/variant) |
| EXTE_PREM_CGST_RATE | 9% (typical) | VM_EW_PARAM | Based on warranty type and date | Yes (per warranty type) |
| EXTE_PREM_SGST_RATE | 9% (typical) | VM_EW_PARAM | Based on warranty type and date | Yes (per warranty type) |
| EXTE_PREM_IGST_RATE | 18% (typical) | VM_EW_PARAM | Based on warranty type and date | Yes (per warranty type) |
| GST_STATE_CD | From VM_EW_PARAM | VM_EW_PARAM | Based on warranty type | Yes (per warranty type) |
| SAC_CODE | From VM_EW_PARAM | VM_EW_PARAM | Based on warranty type | Yes (per warranty type) |
| All vehicle fields | From GM_VIN | GM_VIN | Based on VIN number | No (master data) |
| All customer fields | From GM_CIN | GM_CIN | Based on VIN → customer mapping | No (master data) |
| Loyalty fields | From GD_LOYALTY_ENROL | GD_LOYALTY_ENROL | Based on VIN | No (program data) |
| CCP package details | From AM_LIST | AM_LIST | ADDON_PACKAGE list name | Yes (per principal) |

### Parameter-Driven Defaults

| Parameter Name | Typical Value | Purpose | Used By |
|----------------|---------------|---------|---------|
| P_EWR_CHANGE_DATE | 2024-01-01 (example) | Determines OLD vs NEW warranty type | Warranty type logic |
| p_odmdoc | 2 months | Document requirement mileage offset | Document upload validation |
| p_ccp_mil | 40,000 km | Maximum mileage for CCP eligibility | CCP eligibility check |
| p_purdays | 24 months | Warranty purchase days window | Eligibility validation |
| p_mildoc | 2 months | Document mileage window | Document requirement logic |

### Hardcoded Fallback Defaults

| Field Name | Fallback Value | When Used | Source |
|------------|----------------|-----------|--------|
| EXTE_VALID_MILEAGE | 40,000 km | If GM_VAR.svar_warr_kms IS NULL | VIN validation trigger (line 49) |
| NB_EWR_PUR_MILEAGE | 40,000 km | If GM_VAR.svar_warr_kms IS NULL | VIN validation trigger (line 49) |
| NB_EWR_TYPE | 'O' (OLD) | If retail date comparison fails | VIN validation trigger |

---

## Validation Triggers Summary

| Trigger ID | Field Name | Block | Complexity | Lines | Key Validations | Default Values Set |
|------------|------------|-------|------------|-------|-----------------|-------------------|
| **585** | NB_EWARR_NUM | CB_VT_EWARR_SALE | 43 | 398 | Contract fetch, 60+ field population, registration check | Populates all contract fields from DB |
| **583** | PAY_MODE | CB_VT_EWARR_SALE | Low | ~10 | Mandatory NULL check | None |
| **586** | VIN | B_VT_EWARR_SALE | **74** | **546** | **MOST COMPLEX**: OEM VIN format, warranty eligibility, 40+ field population, address validation, GST validation, free EW check, loyalty lookup, CCP eligibility | **Sets NB_EWR_PUR_MILEAGE** (40K/100K), **NB_EWR_TYPE**, vehicle/customer/loyalty fields |
| **588** | NB_EXTE_WARR_TYPE_OLD | B_VT_EWARR_SALE | 11 | 50 | NEXA/Commercial vehicle validation, warranty details | EXTE_VALID_DATE, EXTE_VALID_MILEAGE, GST parameters |
| **590** | NB_EXTE_WARR_TYPE_NEW | B_VT_EWARR_SALE | 11 | 50 | NEXA/Commercial vehicle validation, warranty details | EXTE_VALID_DATE, EXTE_VALID_MILEAGE, GST parameters |
| **594** | EXTE_WARR_TYPE | B_VT_EWARR_SALE | 11 | 50 | NEXA/Commercial validation, GST lookup | GST_STATE_CD, SAC_CODE, GST_TYPE |
| **598** | EXTE_CONTRACT_MILEAGE | B_VT_EWARR_SALE | Medium | ~30 | Range validation (>= last service, <= purchase limit), CCP eligibility | Sets DUMMY_MILEAGE |
| **597** | EXTE_EMP_CD | B_VT_EWARR_SALE | Low | ~20 | Mandatory, employee existence | NB_EMP_NAME |
| **596** | EXTE_VALID_DATE | B_VT_EWARR_SALE | Low | ~10 | Mandatory, >= SYSDATE | None |
| **592** | LOYL_REDEEM_PTS | B_VT_EWARR_SALE | Low | ~20 | Range (0-balance), OTP control | Resets NB_LOY_OTP_VALIDATE to 'N' |
| **603** | REMARKS | B_EW_DOCS | Low | ~5 | Mandatory NULL check | None |

---

## Critical Default Values - Mileage Configuration

### Source: GM_VAR Table (gm_var)

**Table Columns**:
- `principal_map_cd`: Dealer/principal identifier
- `variant_cd`: Vehicle variant code
- `svar_warr_kms`: Warranty mileage limit for OLD type vehicles (default: 40,000 km)
- `svar_warr_kms_new`: Warranty mileage limit for NEW type vehicles (default: 100,000 km)
- `channel`: Vehicle channel (used in p_veh_type parameter)

**Query Location**: VIN.WHEN-VALIDATE-ITEM trigger (line 49 in gm_ewarr_sale.xml)

**Query Code**:
```sql
SELECT CASE 
    WHEN NVL(:B_VT_EWARR_SALE.NB_EWR_TYPE,'O') = 'O' THEN
        NVL(gm.svar_warr_kms, 40000)         -- OLD warranty: 40,000 km
    WHEN NVL(:B_VT_EWARR_SALE.NB_EWR_TYPE,'O') = 'N' THEN
        NVL(gm.svar_warr_kms_new, 100000)    -- NEW warranty: 100,000 km
    ELSE
        NVL(gm.svar_warr_kms, 40000)         -- Fallback: 40,000 km
END AS warranty_mileage,
channel
INTO :B_VT_EWARR_SALE.nb_ewr_pur_mileage, 
     :PARAMETER.p_veh_type
FROM gm_var gm
WHERE gm.principal_map_cd = :GLOBAL.principal
  AND gm.variant_cd = :B_VT_EWARR_SALE.exte_variant_cd;
```

**Warranty Type Determination Logic**:
```sql
IF :PARAMETER.p_invv_date < :PARAMETER.P_EWR_CHANGE_DATE THEN
    :B_VT_EWARR_SALE.NB_EWR_TYPE := 'O';    -- OLD warranty type
ELSIF :PARAMETER.p_invv_date >= :PARAMETER.P_EWR_CHANGE_DATE THEN
    :B_VT_EWARR_SALE.NB_EWR_TYPE := 'N';    -- NEW warranty type
ELSE
    :B_VT_EWARR_SALE.NB_EWR_TYPE := 'O';    -- Fallback to OLD
END IF;
```

**Configuration Notes**:
1. **Mileage defaults are configurable** per principal (dealer) and variant in GM_VAR table
2. **Fallback values** (40,000 km and 100,000 km) are hardcoded in the trigger as safety defaults
3. **Warranty type** (OLD vs NEW) is determined by comparing vehicle invoice date to P_EWR_CHANGE_DATE parameter
4. **Both fields** (EXTE_VALID_MILEAGE and NB_EWR_PUR_MILEAGE) receive the same default value

---

## Business Rules Summary

### Mandatory Field Requirements

1. **Contract Entry**: NB_EWARR_NUM (for existing contracts) OR VIN (for new contracts)
2. **Payment**: PAY_MODE (mandatory selection)
3. **Vehicle**: VIN (mandatory, triggers 40+ field population)
4. **Warranty**: EXTE_WARR_TYPE or NB_EXTE_WARR_TYPE_OLD/NEW (conditional)
5. **Mileage**: EXTE_CONTRACT_MILEAGE (must be within valid range)
6. **Employee**: EXTE_EMP_CD (service advisor/DSE)
7. **Documents**: Minimum 4 documents with REMARKS (mandatory for each)
8. **CCP**: At least one package must be selected (E0000 or others)

### Critical Validation Sequences

1. **New Contract Flow**:
   - Enter VIN → Validates and populates 40+ fields
   - System sets NB_EWR_TYPE based on retail date
   - System retrieves mileage defaults (40K or 100K) from GM_VAR
   - Select warranty type → Validates and gets validity date/mileage
   - Enter contract mileage → Must be within limits
   - Select employee → Validates against GM_EMP
   - Upload documents → Minimum 4 required
   - Select CCP packages → At least one (including "No Product")
   - System calculates premiums and GST
   - Save contract

2. **Existing Contract Query Flow**:
   - Enter NB_EWARR_NUM → Fetches entire contract
   - System populates all 60+ fields from MWAR_EXTE
   - All editing fields disabled (read-only mode)
   - Can view/download existing documents
   - Can cancel contract (if permitted)

### GST Determination Logic

```
IF warranty_state (from VM_EW_PARAM) = customer_state (from GM_CIN) THEN
    GST_TYPE = 'S' (State GST)
    Apply CGST (typically 9%) + SGST (typically 9%)
ELSE
    GST_TYPE = 'I' (Interstate GST)
    Apply IGST (typically 18%)
END IF
```

### Premium Calculation Formula

```
Base Premium = PKG_EXTE_WAR calculation (based on warranty type, vehicle model, mileage)

IF GST_TYPE = 'S' THEN
    EXTE_PREM_CGST_AMT = Base Premium * CGST Rate / 100
    EXTE_PREM_SGST_AMT = Base Premium * SGST Rate / 100
    EXTE_PREM_IGST_AMT = 0
ELSE
    EXTE_PREM_IGST_AMT = Base Premium * IGST Rate / 100
    EXTE_PREM_CGST_AMT = 0
    EXTE_PREM_SGST_AMT = 0
END IF

EXTE_PREMIUM = Base Premium + CGST + SGST + IGST

CCP_TOTAL = SUM(ADDON_TOT_AMT) where ADDON_YN = 'Y'

TOTAL_PREMIUM = EXTE_PREMIUM + CCP_TOTAL - LOYL_REDEEM_AMT
```

---

## Database Table Dependencies

| Table Name | Purpose | Fields Populated | Default Values Source |
|------------|---------|------------------|---------------------|
| **GM_VAR** | **Vehicle variant master** | **NB_EWR_PUR_MILEAGE, EXTE_VALID_MILEAGE** | **✓ svar_warr_kms (40K), svar_warr_kms_new (100K)** |
| **MWAR_EXTE** | Extended warranty contracts | All fields (during query) | No (transactional data) |
| **GM_VIN** | Vehicle master | Vehicle fields (11 fields) | No (master data) |
| **GM_CIN** | Customer master | Customer fields (13 fields) | No (master data) |
| **GM_EMP** | Employee master | NB_EMP_NAME | No (master data) |
| **VM_EW_PARAM** | Warranty parameters | GST rates, SAC code, state code, validity | ✓ GST rates, SAC codes |
| **AM_LIST** | List of values | Warranty types, CCP packages | ✓ CCP package details |
| **AM_LIST_RANGE** | List ranges | Free EW eligibility, document parameters | ✓ Parameter values |
| **GD_LOYALTY_ENROL** | Loyalty enrollment | Loyalty card details | No (program data) |
| **VT_ADDON** | CCP addon contracts | EXTE_ADDON_POLICY_NO | No (transactional data) |
| **EW_DOCS** | Document storage | Document records | No (transactional data) |

---

## Stored Procedure Calls

| Procedure | Package | Purpose | Default Values Returned |
|-----------|---------|---------|------------------------|
| SP_EW_VIN_VALIDATE | PKG_EXTE_WAR | VIN eligibility validation | None (validation only) |
| SP_EW_DETAILS | PKG_EXTE_WAR | Warranty validity details | EXTE_VALID_DATE, EXTE_VALID_MILEAGE |
| SP_EW_PROJ_MILEAGE | PKG_EXTE_WAR | Projected mileage calculation | NB_PRJ_MILEAGE |
| SP_GET_VEH_DETAILS_EW | - | Vehicle and customer details | 20+ vehicle/customer fields |
| SP_GET_VIN_LOYALTY_DTL | PKG_LOYALTY | Loyalty card details | Loyalty fields |
| SP_VALIDATE_OTP | PKG_LOYALTY | OTP validation for redemption | None (validation only) |
| FN_CONVERT_POINTS_TO_RUPEES | PKG_LOYALTY | Points to rupees conversion | LOYL_REDEEM_AMT |
| SP_VIN_VALIDATE | PKG_ADDON_SALE | CCP eligibility validation | None (validation only) |
| SP_VIN_CCP_ELIGIBLE | PKG_ADDON_SALE | Dynamic CCP eligibility | None (validation only) |
| CALC_PREM | PKG_ADDON_SALE | CCP premium calculation | ADDON_BASIC_AMT (with discount) |
| sp_validate_oemvin | - | OEM VIN format validation | None (validation only) |
| sp_validate_gstn | pkg_einv | GST number format validation | None (validation only) |

---

## Key Takeaways

### Default Values Architecture

1. **System Defaults**: Auto-populated at form/record initialization (dates, user IDs, flags)
2. **Database Defaults**: Retrieved dynamically from configuration tables (mileage limits, GST rates)
3. **Parameter Defaults**: Driven by system parameters (date thresholds, eligibility limits)
4. **Calculated Defaults**: Computed from other field values (totals, amounts, rates)

### Most Important Defaults

| Field | Default Value | Criticality | Configuration |
|-------|---------------|-------------|---------------|
| **NB_EWR_PUR_MILEAGE** | **40K/100K km** | **HIGH** | **Configurable in GM_VAR per variant** |
| **EXTE_VALID_MILEAGE** | **40K/100K km** | **HIGH** | **Configurable in GM_VAR per variant** |
| NB_LOY_OTP_VALIDATE | 'N' | Medium | Hardcoded |
| PAY_MODE | 'C' | Medium | Hardcoded (can be changed by user) |
| ADDON_YN | 'N' | High | Hardcoded (must select at least one) |
| GST rates | 9%/18% | High | Configurable in VM_EW_PARAM |
| DOWNLOAD_YN | 'N' | Low | Hardcoded |

### Validation Priority

1. **VIN** (highest complexity, 546 lines) - Populates 40+ fields
2. **NB_EWARR_NUM** (contract fetch, 398 lines) - Populates 60+ fields
3. **Warranty Type** (50 lines each) - Determines eligibility and limits
4. **Contract Mileage** - Critical range validation
5. **Employee Code** - Mandatory business requirement
6. **Documents** - Minimum 4 required
7. **CCP Selection** - At least one package required

---

**Document End**

*Generated from CAST MCP Server (Imaging) and Oracle Forms XML source analysis*
