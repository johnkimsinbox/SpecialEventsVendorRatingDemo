// VARIABLES FOR EXHIBITOR RATING
var numberOfExhibitors

var riskChosen;
var totalPremium
var brokerFee
var ratePerDay
var NumberOfExhibitor
var liquorRate
var CGLPremium
var brokerPremium
var liquorPremium
var totalPremiumTotal
var riskRate

// GLOBAL VARIABLE USED IN newSubmission
var minimumPremium
var attendance
var rate
var eventDays
var liquorMinimumPremium
var liquorTotalPremium
var liquorRatePremium
var lrate
var temptermLenghtDays
var termLenghtDays
var limit
var miscMinimum
var riskClass


// RATES BASED OFF RISK
var exhibitorRate = 55
var concessionairesNoFoodRate = 80
var concessionairesFoodRate = 90
var attractionRate = 185

// TOTAL SALES
var totalSale
var commercialTotal

// SEPARATE POLICY
var additionalDays
var additionalDaysCost

$(document).ready(function () {
    if ($("li.active").length > 0) {
        riskChosen = getRiskTypeChosen();
    }
    else {
    }
    rate = riskTypeRate(riskRate);

// MONEY FORMAT
    inputMoneyFormat();
// PHONE NUMBER FORMAT
    $(document.body).on('focus', '.phoneNumberMask', function () {
        $(".phoneNumberMask").mask("(999) 999-9999");
    });
// PERCENTAGE FORMAT
    $(document.body).on('focus', '.whatKindOfLiquorIsServed', function () {
        $(".whatKindOfLiquorIsServed").mask("9?99%", {reverse: true});
        $(".whatKindOfLiquorIsServed").on("blur", function () {
            var value = $(this).val().length == 1 ? $(this).val() + '%' : $(this).val();
            $(this).val(value);
        })
    });
// SQUARE FEET FORMAT
    $(document.body).on('focus', '#parkingSquareFoot', function () {
        $('#parkingSquareFoot').mask("*?******* sqft");
        $("#parkingSquareFoot").on("blur", function () {
            var value = $(this).val().length == 1 ? $(this).val() + '' : $(this).val();
            $(this).val(value);
        })
    });
// MIN MAX LIMITS
    $(document.body).on('change', 'input[name="howManyDaysIsTheEvent"]', function () {
        //alert();
        var value, min, max
        validate(value, min, max)
    });

// TOTAL PREMIUM COST
// STATE RATE SELECT FOR LIQUOR RATE
    $("#selectState").change(function () {
        var state = this.value;
        liquorRate = getLiquorRate(state);
    });
// COMMERCIAL GENERAL LIABILITY FEE + POLICY FEE
    $(document.body).on('change', "input[name='separatePolicy'],#numberOfExhibitors,#howManyDaysIsTheEvent", function () {
        numberOfExhibitors = $("#numberOfExhibitors").val()
        eventDays = $("#howManyDaysIsTheEvent").val()
        var eventDaysValue = parseFloat(eventDays)
        // var rateValue = parseFloat(rate)
        if (eventDays.length > 0) {
            CGLPremium = getCGLPremium(totalPremiumCGL)
            $(".commercialGeneralLiabilityPremiumCost").html("$" + CGLPremium);
            $("#termsInsert").css('display', "");
            $("#endorseInsert").css('display', "");
            getFinalTotalPremium()
        }
    });
// ALCOHOL PREMIUM
    $(document.body).on('change', "#alcoholSales", function () {
        var liquorTotalPremium
        liquorTotalPremium = getLiquorPremium(liquorTotalPremium)
        $("#alcoholSalePremiumCost").html("$" + liquorTotalPremium);
        $(".effectsTotalPremiumPlaceholder").addClass("effectsTotalPremium");
        $(".premDistributionInsertIfUsed").addClass("premDistributionInsert");
        getFinalTotalPremium()
    });
// ALCOHOL TYPE PERCENTAGE
    $(document.body).on('change', ".whatKindOfLiquorIsServed", function () {
        var beer = $("#whatKindOfLiquorIsServedBeer").val(),
            wine = $("#whatKindOfLiquorIsServedWine").val(),
            fullBar = $("#whatKindOfLiquorIsServedFullBar").val(),
            totalPercent,
            alcoholTotalPercent;

        if (beer.length > 0 && wine.length > 0 && fullBar.length > 0) {
            alcoholTotalPercent = 0;
            alcoholTotalPercent = alcoholPercentage(totalPercent)
            if (alcoholTotalPercent == 100) {
            }
            else if (alcoholTotalPercent != 100) {
                alert("please enter values that add up to 100%")
                $("#whatKindOfLiquorIsServedBeer").val("")
                $("#whatKindOfLiquorIsServedWine").val("")
                $("#whatKindOfLiquorIsServedFullBar").val("")
            }
        }
        else if ($(this).val().length > 0) {
            alcoholTotalPercent = alcoholPercentage(totalPercent)
            if (alcoholTotalPercent == 100) {
                if ($("#whatKindOfLiquorIsServedBeer").val().length == 0) {
                    $("#whatKindOfLiquorIsServedBeer").val('00%')
                }
                ;
                if ($("#whatKindOfLiquorIsServedWine").val().length == 0) {
                    $("#whatKindOfLiquorIsServedWine").val('00%')
                }
                ;
                if ($("#whatKindOfLiquorIsServedFullBar").val().length == 0) {
                    $("#whatKindOfLiquorIsServedFullBar").val('00%')
                }
                ;
            }
        }
    });
// BROKER PREMIUM
    $(document.body).on('change', "#brokerFeeInput", function () {
        var brokerFeeTotal
        brokerPremium = getBrokerPremium(brokerFeeTotal)
        $("#brokerFeePremiumCost").html("$" + brokerPremium);
    });
// TOTAL PREMIUM COST

// STEP 1
// CGL TABLE
    $(document.body).on('change', 'input[name="commercialGeneralLiabilityRequested"]', function () {
        //alert();
        if ($(this).attr("value") == "Yes") {
            $("#commercialGeneralLiabilityRequestedContainer").css('display', "");
            $(".additionalCoverageContainer").css('display', "");
            $("#commercialGeneralLiabilityRequestedExplain").css('display', "");
            $(".tableCGL").addClass("showReviewTable");
        }
        if ($(this).attr("value") == "No") {
            $("#commercialGeneralLiabilityRequestedContainer").css('display', "none");
            $(".additionalCoverageContainer").css('display', "none");
            $("#commercialGeneralLiabilityRequestedExplain").css('display', "none");
            $(".tableCGL").removeClass("showReviewTable");
        }
    });
// ALCOHOL TABLE / ADDITIONAL HIDDEN QUESTION / PREMIUMS
    $(document.body).on('change', 'input[name="willAlcoholBeServed"]', function () {
        //alert();
        if ($(this).attr("value") == "Yes") {
            $(".alcoholSaleContainer").css('display', "");
            $(".alcoholSaleExplain").css('display', "");

            $(".alcoholSaleTableContainer").css('display', "");
            $(".alcoholSaleTableExplain").css('display', "")
            $(".tableAlcohol").addClass("showReviewTable");
        }
        if ($(this).attr("value") == "No") {
            $(".alcoholSaleContainer").css('display', "none");
            $(".alcoholSaleExplain").css('display', "none");

            $(".alcoholSaleTableContainer").css('display', "none");
            $(".alcoholSaleTableExplain").css('display', "none");
            $(".tableAlcohol").removeClass("showReviewTable");
        }
    });
// BROKER FEE HIDDEN PREMIUM
    $(document.body).on('change', '.brokerFeeInput', function () {
        //alert();
        var brokerFeeCostTemp = $(".brokerFeeInput").val()
        var brokerFeeCost = brokerFeeCostTemp.replace('$', '').replace(',', '')
        var brokerFeeCostValue = parseFloat(brokerFeeCost)

        if (brokerFeeCostValue > 0) {
            $("#brokerFeePremiumContainer").css('display', "");
            $("#brokerFeePremiumExplain").css('display', "");
        }
        else if (brokerFeeCostValue <= 0) {
            $("#brokerFeePremiumContainer").css('display', "none");
            $("#brokerFeePremiumExplain").css('display', "none");
        }
    });

// STEP 2
// ON CHANGE ADDITIONAL QUESTIONS SHOW REVIEW RADIO BUTTON (VALUE = YES)
    $(document.body).on('change', '.additionalQuestionOnChangeRadio', function () {
        var elem = $(this);
        onChangeRadio(elem)
    });
// ON CHANGE ADDITIONAL QUESTIONS SHOW REVIEW RADIO BUTTON REVERSED (VALUE = NO)
    $(document.body).on('change', '.additionalQuestionOnChangeRadioReverse', function () {
        var elem = $(this);
        onChangeRadioReverse(elem)
    });
// ON CHANGE ADDITIONAL QUESTIONS SHOW REVIEW INPUT FIELD
    $(document.body).on('change', '.additionalQuestionOnChangeInput', function () {
        var elem = $(this);
        onChangeInput(elem)
    });
// ON CHANGE ADDITIONAL QUESTIONS SHOW REVIEW CHECKBOX
    $(document.body).on('change', '.additionalQuestionOnChangeChecked', function () {
        var elem = $(this);
        onChangeChecked(elem)
    });
// ON CHANGE ADDITIONAL QUESTIONS SHOW REVIEW SELECT
    $(document.body).on('change', '.additionalQuestionOnChangeSelect', function () {
        var elem = $(this);
        onChangeSelect(elem)
    });
// Y/N RISK HAZARD QUESTION
    $(document.body).on('change', '.riskHazard', function () {
        if ($(".riskHazard").is(':checked')) {
            alert("Due to the risk hazards of this event, the indication provided in the previous page is no longer valid. Please proceed with entering all the information requested following this notification and an underwriter will be contacting you shortly. Please note, we may not be able to offer terms based on additional information received")
        }
    });

// ADDITIONAL COVERAGES
// SELECT MISC EQUIPMENT CONTAINER ADDITIONAL QUESTION
    $(document.body).on('change', '.miscCheckbox', function () {
        $('.miscCheckbox').not(this).prop('checked', false);
        if ($('.limitMiscellaneous').val().length > 0) {
            getMiscellaneousEquipmentDeductible()
            getMiscellaneousEquipmentRating();
        }

        if ($(".miscCheckbox").is(':checked')) {
            $('.inlandMarineContainer').css("display", "");
            $('.miscContainer').css("display", "");
        }
        else {
            $('.inlandMarineContainer').css("display", "none");
            $('.miscContainer').css("display", "none");
            $(".premiumMiscellaneous").removeClass("effectsTotal");
            additionalCLGPremiums()
        }
    });
    $(document.body).on('change', '.limitMiscellaneous', function () {
        getMiscellaneousEquipmentDeductible()
        getMiscellaneousEquipmentRating();
    });
// SELECT THIRD PARTY PROPERTY DAMAGE CONTAINER ADDITIONAL QUESTION
    $(document.body).on('change', '#thirdPartyCheckbox', function () {
        if ($("#thirdPartyCheckbox").is(':checked')) {
            $('.thirdPartyContainer').css("display", "");
            $('.inlandMarineContainer').css("display", "");
            getThirdPartyRating()
        }
        else {
            $('.thirdPartyContainer').css("display", "none");
            $('.inlandMarineContainer').css("display", "none");
            $(".premiumThirdParty").removeClass("effectsTotal");
            additionalCLGPremiums()
        }
    });
// GENERAL AGGREGATE LIMIT
    $('.limitGeneralAggregate').change(function () {
        // $(document.body).on('change', '#securityType' ,function () {
        var option = $(this).find('option:selected').val();
        // alert(option);
        if (option == "additional") {
            $(".premiumGeneralAggregate").addClass("effectsTotal");
            $(".premiumGeneralAggregate").html("$" + "250");
            additionalCLGPremiums()

        }
        if (option == "standard") {
            $(".premiumGeneralAggregate").removeClass("effectsTotal");
            $(".premiumGeneralAggregate").html("");
            additionalCLGPremiums()
        }
    });
// PRODUCT AND COMPLETED OPERATION LIMIT
    $('.limitProductAndCompletedOperations').change(function () {
        // $(document.body).on('change', '#securityType' ,function () {
        var option = $(this).find('option:selected').val();
        // alert(option);
        if (option == "additional") {
            $(".premiumProductAndCompletedOperations").html("$" + "250");
            $(".premiumProductAndCompletedOperations").addClass("effectsTotal");
            additionalCLGPremiums()
        }
        if (option == "standard") {
            $(".premiumProductAndCompletedOperations").html("");
            $(".premiumProductAndCompletedOperations").removeClass("effectsTotal");
            additionalCLGPremiums()
        }
    });
// PREMISES DAMAGE LIMIT
    $('.limitPremisesDamage').change(function () {
        // $(document.body).on('change', '#securityType' ,function () {
        var option = $(this).find('option:selected').val();
        // alert(option);
        if (option == "additional") {

            temptermLenghtDays = $("#proposedTermLength").val().split(" ")[0]
            termLenghtDays = parseInt(temptermLenghtDays)

            if (termLenghtDays > 0 && termLenghtDays <= 90) {
                $(".premiumPremisesDamage").html("$" + "100");
                $(".premiumPremisesDamage").addClass("effectsTotal");
                additionalCLGPremiums()
            }

            else if (termLenghtDays > 91 && termLenghtDays <= 180) {
                $(".premiumPremisesDamage").html("$" + "250");
                $(".premiumPremisesDamage").addClass("effectsTotal");
                additionalCLGPremiums()
            }

            else if (termLenghtDays > 181) {
                $(".premiumPremisesDamage").html("$" + "450");
                $(".premiumPremisesDamage").addClass("effectsTotal");
                additionalCLGPremiums()
            }
        }
        if (option == "standard") {
            $(".premiumPremisesDamage").removeClass("effectsTotal");
            $(".premiumPremisesDamage").html("");
            additionalCLGPremiums()
        }
    });
// MEDICAL LIMIT
    $('.limitMedicalExpenses').change(function () {
        // $(document.body).on('change', '#securityType' ,function () {
        var option = $(this).find('option:selected').val();
        // alert(option);
        if (option == "additional") {
            alert("MEDICAL EXPENSE COVERAGE MUST BE REQUIRED BY CONTRACT IF SELECTED")
            $(".premiumMedicalExpenses").html("$" + "250");
            $(".premiumMedicalExpenses").addClass("effectsTotal");
            additionalCLGPremiums()
        }
        if (option == "standard") {
            $(".premiumMedicalExpenses").html("");
            $(".premiumMedicalExpenses").removeClass("effectsTotal");
            additionalCLGPremiums()
        }
    });
})
;

// CGL PREMIUMS
function riskTypeRate(riskRate) {

    if (riskChosen === "Exhibitor") {
        riskClass = exhibitorRate;
        // alert(rate)
    }
    else if (riskChosen === "Concessionaires Non Food Sales") {
        riskClass = concessionairesNoFoodRate;
        // alert(rate)
    }
    else if (riskChosen === "Concessionaires Food Sales") {
        riskClass = concessionairesFoodRate;
        // alert(rate)
    }
    else if (riskChosen === "Attractions / Performers") {
        riskClass = attractionRate;
        // alert(rate)
    }
    return riskClass;
}
function getCGLPremium(totalPremiumCGL) {
    var numberOfExhibitors = $("#numberOfExhibitors").val(),
        numberOfExhibitorsValue = parseFloat(numberOfExhibitors),
        eventDays = $("#howManyDaysIsTheEvent").val(),
        eventDaysValue = parseFloat(eventDays),
        separatePolicy = $("input[name='separatePolicy']:checked").val(),
        rateValue = parseFloat(rate),
        policyFee = 0;


    if (separatePolicy == "Yes") {
        if (eventDays.length > 0) {

            if (riskChosen === "Exhibitor") {
                if (eventDaysValue <= 3) {
                    totalPremium = 150
                    policyFee = 100
                    $("#policyFeePremiumCost").html("$" + policyFee);
                }
                else if (eventDaysValue > 3) {
                    additionalDaysCost = 50
                    additionalDays = eventDaysValue - 3
                    totalPremium = additionalDaysCost * additionalDays + 150
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Concessionaires Non Food Sales") {
                if (eventDaysValue <= 3) {
                    totalPremium = 175
                    policyFee = 100
                    $("#policyFeePremiumCost").html("$" + policyFee);
                }

                else if (eventDaysValue > 3) {
                    additionalDaysCost = 50
                    additionalDays = eventDaysValue - 3
                    totalPremium = additionalDaysCost * additionalDays + 150
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Concessionaires Food Sales") {
                if (eventDaysValue <= 3) {
                    totalPremium = 200
                    policyFee = 100
                    $("#policyFeePremiumCost").html("$" + policyFee);
                }
                else if (eventDaysValue > 3) {
                    additionalDaysCost = 50
                    additionalDays = eventDaysValue - 3
                    totalPremium = additionalDaysCost * additionalDays + 150
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Attractions / Performers") {
                if (eventDaysValue <= 3) {
                    totalPremium = 150
                    policyFee = 100
                    $("#policyFeePremiumCost").html("$" + policyFee);
                }
                else if (eventDaysValue > 3) {
                    additionalDaysCost = 50
                    additionalDays = eventDaysValue - 3
                    totalPremium = additionalDaysCost * additionalDays + 150
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        var policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            $("#commercialGeneralLiabilityPremiumCost").html("$" + totalPremium);
        }
    }
    else if (separatePolicy == "No") {
        if (numberOfExhibitors.length > 0 && eventDays.length > 0) {

            if (riskChosen === "Exhibitor") {

                ratePerDay = rateValue * numberOfExhibitorsValue
                if (ratePerDay > 300) {
                    ratePerDay = 300
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }

                }
                else if (ratePerDay < 300) {
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Concessionaires Non Food Sales") {

                ratePerDay = rateValue * numberOfExhibitorsValue

                if (ratePerDay > 425) {
                    ratePerDay = 425
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        var policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
                else if (ratePerDay < 425) {
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Concessionaires Food Sales") {

                ratePerDay = rateValue * numberOfExhibitorsValue

                if (ratePerDay > 475) {
                    ratePerDay = 475
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
                else if (ratePerDay < 475) {
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
            else if (riskChosen === "Attractions / Performers") {

                ratePerDay = rateValue * numberOfExhibitorsValue

                if (ratePerDay > 950) {
                    ratePerDay = 950
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
                else if (ratePerDay < 950) {
                    totalPremium = ratePerDay * eventDaysValue
                    if (totalPremium < 250) {
                        policyFee = 100
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                    else if (totalPremium >= 250) {
                        policyFee = 50
                        $("#policyFeePremiumCost").html("$" + policyFee);
                    }
                }
            }
        }
    }
    return totalPremium;
}
// TRIGGERS ADDITIONAL CGL PREMIUM INCREASE FOR ADDITIONAL LIMIT
function additionalCLGPremiums() {
    var PremiumCGL = getCGLTotalPremium()
    $("#commercialGeneralLiabilityPremiumCost").html("$" + PremiumCGL);
    getFinalTotalPremium()
}
// CALCULATES CGL + ADDITIONAL CGL PREMIUMS
function getCGLTotalPremium() {

    var checkCGLPremium = 0
    checkCGLPremium = getCGLPremium()
    // alert(checkCGLPremium + "TWO")

    $('div#commercialGeneralLiabilityRequestedContainer div.premiumColumn span.effectsTotal').each(function () {
        if ($(this).html().length > 0) {
            var tempCoverage = parseFloat($(this).html().replace('$', '').replace(/,/g, ''));
            checkCGLPremium = checkCGLPremium + tempCoverage
        }
    });
    return checkCGLPremium
}

// LIQUOR PREMIUMS
// LIQUOR RATE PER STATE
function getLiquorRate(state) {
    liquorRate = 0;
    if (state == "DE" ||
        state == "KS" ||
        state == "MD" ||
        state == "NV" ||
        state == "SD" ||
        state == "VA") {
        liquorRate = 8
    }
    else if (state == "AR" ||
        state == "CA" ||
        state == "CO" ||
        state == "GA" ||
        state == "ID" ||
        state == "IL" ||
        state == "KY" ||
        state == "LA" ||
        state == "ME" ||
        state == "MN" ||
        state == "MS" ||
        state == "MO" ||
        state == "NE" ||
        state == "NJ" ||
        state == "OH" ||
        state == "OR" ||
        state == "TN") {
        liquorRate = 12
    }
    else if (state == "AZ" ||
        state == "IN" ||
        state == "MA" ||
        state == "MI" ||
        state == "MT" ||
        state == "NM" ||
        state == "NY" ||
        state == "NC" ||
        state == "ND" ||
        state == "OK" ||
        state == "RI" ||
        state == "SC" ||
        state == "TX" ||
        state == "UT") {
        liquorRate = 14
    }
    else if (state == "DC" ||
        state == "IA" ||
        state == "PA" ||
        state == "WV") {
        liquorRate = 15
    }
    else if (state == "AL" ||
        state == "VT") {
        liquorRate = 50
    }
    else if (state == "AK" ||
        state == "CT" ||
        state == "DC" ||
        state == "FL" ||
        state == "NH" ||
        state == "WA" ||
        state == "HI") {
        alert("STATE NOT ELIGIBLE FOR LIQUOR COVERAGE")
    }
    return liquorRate;
}
// CALCULATES LIQUOR MINIMUM PREMIUM COST
function getLiquorMinimumPremium(liquorMinimumPremium) {
// $25,000 LIQUOR SALES AND BELOW
    var liquorMinimum8Below25000 = 100,
        liquorMinimum12Below25000 = 375,
        liquorMinimum14Below25000 = 550,
        liquorMinimum15Below25000 = 750,
        liquorMinimum50Below25000 = 1000,
// $25,000 LIQUOR SALES AND ABOVE
        liquorMinimum8Above25000 = 100,
        liquorMinimum12Above25000 = 750,
        liquorMinimum14Above25000 = 800,
        liquorMinimum15Above25000 = 900,
        liquorMinimum50Above25000 = 2500,
        liquorMinimumPremium = 0,
// ALCOHOL PREMIUMS
        alcoholInputVal = $("#alcoholSales").val(),
        liquorSale = alcoholInputVal.replace('$', '').replace(/,/g, ''),
        liquorSaleValue = parseFloat(liquorSale),
        eventDaysValue = parseFloat($("#howManyDaysIsTheEvent").val()),
        attendanceValue = parseFloat($("#estimatedTotalAttendance").val());

    if (liquorSaleValue > 0 && eventDaysValue > 0 && eventDaysValue <= 5) {
        if (liquorRate == 8) {
            liquorMinimumPremium = liquorMinimum8Below25000
        }
        else if (liquorRate == 12) {
            liquorMinimumPremium = liquorMinimum12Below25000
        }
        else if (liquorRate == 14) {
            liquorMinimumPremium = liquorMinimum14Below25000
        }
        else if (liquorRate == 15) {
            liquorMinimumPremium = liquorMinimum15Below25000
        }
        else if (liquorRate == 50) {
            liquorMinimumPremium = liquorMinimum50Below25000
        }
    }
    else if (liquorSaleValue > 0 && eventDaysValue > 5) {
        if (liquorRate == 8) {
            liquorMinimumPremium = liquorMinimum8Above25000
        }
        else if (liquorRate == 12) {
            liquorMinimumPremium = liquorMinimum12Above25000
        }
        else if (liquorRate == 14) {
            liquorMinimumPremium = liquorMinimum14Above25000
        }
        else if (liquorRate == 15) {
            liquorMinimumPremium = liquorMinimum15Above25000
        }
        else if (liquorRate == 50) {
            liquorMinimumPremium = liquorMinimum50Above25000
        }
    }
    return liquorMinimumPremium
}
// CALCULATES LIQUOR PREMIUM TOTAL
function getLiquorPremium(liquorTotalPremium) {
    var liquorMinimumPremium = getLiquorMinimumPremium(liquorMinimumPremium),
        alcoholInputVal = $("#alcoholSales").val(),
        liquorSale = alcoholInputVal.replace('$', '').replace(/,/g, ''),
        liquorSaleValue = parseFloat(liquorSale),
        liquorRatePremium = liquorRate * liquorSaleValue / 1000;
    if (liquorMinimumPremium < liquorRatePremium) {
        liquorTotalPremium = liquorRatePremium
    }
    else if (liquorMinimumPremium > liquorRatePremium) {
        liquorTotalPremium = liquorMinimumPremium
    }
    return liquorTotalPremium
}

// ADDITIONAL COVERAGES OPTIONAL ADD ONS TO CGL PREMIUM
// CALCULATES MISCELLANEOUS EQUIPMENT DEDUCTIBLE
function getMiscellaneousEquipmentDeductible() {
    var tempMiscellaneousDeductible = $("#limitMiscellaneous").val()
    tempMiscellaneousDeductible = tempMiscellaneousDeductible.replace('$', '').replace(/,/g, '')
    var miscellaneousDeductible = parseInt(tempMiscellaneousDeductible)

    if (miscellaneousDeductible > 0 && miscellaneousDeductible <= 50000) {
        $(".deductibleMiscellaneous").html("$" + "1000");
    }
    else if (miscellaneousDeductible > 50000 && miscellaneousDeductible <= 150000) {
        $(".deductibleMiscellaneous").html("$" + "1500");
    }
    else if (miscellaneousDeductible > 150000 && miscellaneousDeductible <= 350000) {
        $(".deductibleMiscellaneous").html("$" + "2000");
    }
    else if (miscellaneousDeductible > 350000 && miscellaneousDeductible <= 1000000) {
        $(".deductibleMiscellaneous").html("$" + "2500");
    }
    else if (miscellaneousDeductible > 1000001) {
        alert("refer to company")
    }
}
// CALCULATES MISCELLANEOUS EQUIPMENT RATING / PREMIUM
function getMiscellaneousEquipmentRating() {
    var inlandRate = 0
    var eventDay = parseFloat($("#howManyDaysIsTheEvent").val());
    var tempMiscellaneousLimit = $("#limitMiscellaneous").val()
    tempMiscellaneousLimit = tempMiscellaneousLimit.replace('$', '').replace(/,/g, '')
    var tempLimit = parseFloat(tempMiscellaneousLimit)
    micsMinimum = 0

    if ($("#miscUsaCheckbox").is(':checked')) {
        if (eventDay > 0 && eventDay <= 30) {
            miscMinimum = 100
            var tempDividedLimit = tempLimit / 100
            limit = 0
            limit = tempDividedLimit * 0.50
            if (limit > miscMinimum) {
                $(".premiumMiscellaneous").html("$" + limit);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
            else if (limit < miscMinimum) {
                $(".premiumMiscellaneous").html("$" + miscMinimum);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
        }
        else if (eventDay > 31 && eventDay <= 90) {
            miscMinimum = 250
            var tempDividedLimit = tempLimit / 100
            limit = 0
            limit = tempDividedLimit * 0.75
            if (limit > miscMinimum) {
                $(".premiumMiscellaneous").html("$" + limit);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
            else if (limit < miscMinimum) {
                $(".premiumMiscellaneous").html("$" + miscMinimum);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
        }
    }
    else if ($("#miscWorldCheckbox").is(':checked')) {
        if (eventDay > 0 && eventDay <= 30) {
            miscMinimum = 125
            var tempDividedLimit = tempLimit / 100
            limit = 0
            limit = tempDividedLimit * 0.63
            if (limit > miscMinimum) {
                $(".premiumMiscellaneous").html("$" + limit);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
            else if (limit < miscMinimum) {
                $(".premiumMiscellaneous").html("$" + miscMinimum);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
        }
        else if (eventDay > 31 && eventDay <= 90) {
            miscMinimum = 313
            var tempDividedLimit = tempLimit / 100
            limit = 0
            limit = tempDividedLimit * 0.94
            if (limit > miscMinimum) {
                $(".premiumMiscellaneous").html("$" + limit);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
            else if (limit < miscMinimum) {
                $(".premiumMiscellaneous").html("$" + miscMinimum);
                $(".premiumMiscellaneous").addClass("effectsTotal");
                additionalCLGPremiums()
            }
        }
    }
}
// CALCULATES THIRD PARTY PROPERTY DAMAGE RATING / PREMIUM / DEDUCTIBLE
function getThirdPartyRating() {
    var eventDay = parseFloat($("#howManyDaysIsTheEvent").val());
    if (eventDay > 0 && eventDay <= 30) {
        var premiumThirdParty = 420
        var deductibleThirdParty = 2500
        $(".premiumThirdParty").html("$" + premiumThirdParty);
        $(".deductibleThirdParty").html("$" + deductibleThirdParty);
        $(".premiumThirdParty").addClass("effectsTotal");
        additionalCLGPremiums()
    }
    else if (eventDay > 31 && eventDay <= 60) {
        var premiumThirdParty = 820
        $(".premiumThirdParty").html("$" + premiumThirdParty);
        $(".deductibleThirdParty").html("$" + deductibleThirdParty);
        $(".premiumThirdParty").addClass("effectsTotal");
        additionalCLGPremiums()
    }
    else if (eventDay > 61 && eventDay <= 90) {
        var premiumThirdParty = 1235
        $(".premiumThirdParty").html("$" + premiumThirdParty);
        $(".deductibleThirdParty").html("$" + deductibleThirdParty);
        $(".premiumThirdParty").addClass("effectsTotal");
        additionalCLGPremiums()
    }
}

// TOTAL PREMIUM
// TRIGGERS CHANGE IN TOTAL PREMIUM
function getFinalTotalPremium() {

    attendance = $("#estimatedTotalAttendance").val()
    eventDays = $("#howManyDaysIsTheEvent").val()
    var attendanceValue = parseFloat(attendance)
    var eventDaysValue = parseFloat(eventDays)
    // var rateValue = parseFloat(rate)
    if (attendance.length > 0 && eventDays.length > 0) {
        var totalPremiumTotal = 0
        totalPremiumTotal = getTotalPremium()
        $("#totalSalePremiumCost").html("$" + totalPremiumTotal);
    }
}
// CALCULATES TOTAL PREMIUM TOTAL
function getTotalPremium() {

    var totalCoveragePremium = 0
    console.log("prior to total cycle" + totalCoveragePremium)

    $('div#premiumDistDivContainer div.premDistributionInsert span.effectsTotalPremium').each(function () {
        if ($(this).html().length > 0) {
            var tempVal = parseFloat($(this).html().replace('$', '').replace(/,/g, ''));
            // var totalPremiumValue = parseFloat $(this)
            console.log("cycle" + $(this))
            console.log("cycle" + tempVal)
            console.log("cycle" + totalCoveragePremium)
            totalCoveragePremium = totalCoveragePremium + tempVal
            // alert (totalPremium)
        }
    });
    // alert("TOTALCOVERAGE" + totalCoveragePremium)
    return totalCoveragePremium
}

// BROKER FEE
function getBrokerPremium(brokerFeeTotal) {
    var tempBrokerFee,
        brokerFee,
        brokerFeeValue;

    tempBrokerFee = $("#brokerFeeInput").val()
    brokerFee = tempBrokerFee.replace('$', '').replace(/,/g, '');
    if (brokerFee.length > 0) {
        brokerFeeValue = parseFloat(brokerFee)
    }
    return brokerFeeValue
}
// MASKS INPUT INTO MONEY FORMAT
function inputMoneyFormat() {
    $('.moneyFormat').maskMoney({prefix: '$', precision: "0"});
}
// MIN MAX VALUES FOR EVENT DAYS
function validate(value, min, max) {
    if (parseInt(value) < min || isNaN(parseInt(value))) {
        return "";
    }
    else if (parseInt(value) > max) {
        alert("Please contact your underwriter if your event exceeds 90 days");
        return 90;
    }
    else return value;
}
// ALCOHOL PERCENT CALCULATOR
function alcoholPercentage(totalPercent) {
    var total = 0,
        temp;

    $(".whatKindOfLiquorIsServed").each(function () {
        if ($(this).val().length > 0) {
            tempVal = ($(this).val())
            tempVal = parseFloat(tempVal);
            total = total + tempVal
        }
    });
    return total
}
// ONCHANGE ADDITIONAL QUESTIONS AND SHOWREVIEW RADIO BUTTON Y/N
function onChangeRadio(elem) {
    if (elem.prop("value") == "Yes") {
        $("#" + elem.prop('name') + "Container").css('display', "");
        $("." + elem.prop('name') + "ShowReview").addClass("showReview");
    }
    else if (elem.prop("value") == "No") {
        $("#" + elem.prop('name') + "Container").css('display', "none");
        $("." + elem.prop('name') + "ShowReview").removeClass("showReview");
    }
}
// ONCHANGE ADDITIONAL QUESTIONS AND SHOWREVIEW RADIO BUTTON REVERSE Y/N
function onChangeRadioReverse(elem) {
    if (elem.prop("value") == "Yes") {
        $("#" + elem.prop('name') + "Container").css('display', "none");
        $("." + elem.prop('name') + "ShowReview").removeClass("showReview");
    }
    else if (elem.prop("value") == "No") {
        $("#" + elem.prop('name') + "Container").css('display', "");
        $("." + elem.prop('name') + "ShowReview").addClass("showReview");
    }
}
// ONCHANGE ADDITIONAL QUESTION AND SHOWREVIEW INPUT VALUE
function onChangeInput(elem) {
    var inputVal = elem.prop('value');

    if (inputVal.length > 1) {
        $("." + elem.prop('name') + "Container").css('display', "");
        $("." + elem.prop('name') + "ShowReview").addClass("showReview");
    }
    else if (inputVal.length < 1) {
        $("." + elem.prop('name') + "Container").css('display', "none");
        $("." + elem.prop('name') + "ShowReview").removeClass("showReview");
    }
}
// ONCHANGE ADDITIONAL QUESTION AND SHOWREVIEW CHECKED
function onChangeChecked(elem) {
    var checked = elem.prop('id')

    if (document.getElementById(checked).checked) {
        $("." + elem.prop('name') + "Container").css('display', "");
        $("." + elem.prop('name') + "ShowReview").addClass("showReview");
    }
    else {
        $("." + elem.prop('name') + "Container").css('display', "none");
        $("." + elem.prop('name') + "ShowReview").removeClass("showReview");
    }
}
// ONCHANGE ADDITIONAL QUESTION AND SHOWREVIEW SELECT
function onChangeSelect(elem) {
    var option = elem.find('option:selected').val();

    if (option == "invalid") {
        $("." + elem.prop('name') + "Container").css('display', "none");
        $("." + elem.prop('name') + "ShowReview").removeClass("showReview");
    }
    else {
        $("." + elem.prop('name') + "Container").css('display', "");
        $("." + elem.prop('name') + "ShowReview").addClass("showReview");
    }
}

