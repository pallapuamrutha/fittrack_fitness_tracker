package com.fittrack.android.health

import android.content.Context
import android.webkit.JavascriptInterface
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import kotlinx.coroutines.runBlocking
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

/**
 * Android Health Connect Native JavaScript Interface Bridge
 *
 * Injected into the Android WebView via:
 * webView.addJavascriptInterface(HealthConnectBridge(context), "AndroidHealthConnect")
 *
 * Provides type-safe access to Android Health Connect APIs for FitTrack web client.
 */
class HealthConnectBridge(private val context: Context) {

    private val healthConnectClient: HealthConnectClient? by lazy {
        if (HealthConnectClient.getSdkStatus(context) == HealthConnectClient.SDK_AVAILABLE) {
            HealthConnectClient.getOrCreate(context)
        } else {
            null
        }
    }

    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    /**
     * Checks if Health Connect is available on the user's Android device
     */
    @JavascriptInterface
    fun checkAvailability(): String {
        return when (HealthConnectClient.getSdkStatus(context)) {
            HealthConnectClient.SDK_AVAILABLE -> "AVAILABLE"
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> "NOT_INSTALLED"
            else -> "NOT_SUPPORTED"
        }
    }

    /**
     * Checks whether READ_STEPS permission is currently granted
     */
    @JavascriptInterface
    fun checkPermission(permissionName: String): Boolean = runBlocking {
        val client = healthConnectClient ?: return@runBlocking false
        val granted = client.permissionController.getGrantedPermissions()
        return@runBlocking granted.contains(stepPermission)
    }

    /**
     * Returns today's total aggregated steps
     */
    @JavascriptInterface
    fun getTodaySteps(): Long = runBlocking {
        val client = healthConnectClient ?: return@runBlocking 0L
        val now = LocalDateTime.now()
        val startOfDay = LocalDate.now().atStartOfDay()

        val response = client.aggregate(
            AggregateRequest(
                metrics = setOf(StepsRecord.COUNT_TOTAL),
                timeRangeFilter = TimeRangeFilter.between(
                    startOfDay.atZone(ZoneId.systemDefault()).toInstant(),
                    now.atZone(ZoneId.systemDefault()).toInstant()
                )
            )
        )
        return@runBlocking response[StepsRecord.COUNT_TOTAL] ?: 0L
    }

    /**
     * Reads historical daily step counts between startDate and endDate (YYYY-MM-DD)
     * Returns a JSON array string of DailyStepRecord objects
     */
    @JavascriptInterface
    fun getStepsHistory(startDateStr: String, endDateStr: String): String = runBlocking {
        val client = healthConnectClient ?: return@runBlocking "[]"
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE

        val startDate = LocalDate.parse(startDateStr, formatter).atStartOfDay()
        val endDate = LocalDate.parse(endDateStr, formatter).plusDays(1).atStartOfDay()

        val recordsResponse = client.readRecords(
            ReadRecordsRequest(
                recordType = StepsRecord::class,
                timeRangeFilter = TimeRangeFilter.between(
                    startDate.atZone(ZoneId.systemDefault()).toInstant(),
                    endDate.atZone(ZoneId.systemDefault()).toInstant()
                )
            )
        )

        // Aggregate steps by date
        val dailyMap = mutableMapOf<String, Long>()
        for (record in recordsResponse.records) {
            val dateStr = record.startTime.atZone(ZoneId.systemDefault()).toLocalDate().format(formatter)
            dailyMap[dateStr] = (dailyMap[dateStr] ?: 0L) + record.count
        }

        val jsonArray = JSONArray()
        for ((date, steps) in dailyMap) {
            val item = JSONObject()
            item.put("date", date)
            item.put("steps", steps)
            item.put("lastUpdated", LocalDateTime.now().toString())
            item.put("source", "health_connect")
            item.put("deviceName", "Android Health Connect")
            jsonArray.put(item)
        }

        return@runBlocking jsonArray.toString()
    }
}
