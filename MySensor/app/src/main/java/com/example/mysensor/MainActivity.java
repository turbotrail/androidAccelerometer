package com.example.mysensor;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.Socket;
import java.net.URL;
import java.net.URLEncoder;
import java.net.UnknownHostException;

import androidx.appcompat.app.AppCompatActivity;

import static android.content.ContentValues.TAG;

public class MainActivity extends AppCompatActivity implements SensorEventListener {
    private static final String TAG = "MainActivity";
    private SensorManager sensorManager;
    Sensor accelerometer;

    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.support_simple_spinner_dropdown_item);
        Log.d(TAG, "onCreate: Initialising");


        sensorManager=(SensorManager) getSystemService(Context.SENSOR_SERVICE);
        accelerometer=sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        sensorManager.registerListener(MainActivity.this,accelerometer,SensorManager.SENSOR_DELAY_NORMAL);
        Log.d(TAG, "onCreate: Registering");
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        Log.d(TAG, "onSensorChanged: X:"+event.values[0]+"Y:"+event.values[1]+"Z:"+event.values[2]);
        MyTaskParams params = new MyTaskParams(event.values[0],event.values[1],event.values[2]);
        new LongOperation().execute(params);
//        try {
//            Thread.sleep(1000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }

    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

}
class MyTaskParams {
    float x;
    float y;
    float z;

    MyTaskParams(float x,float y,float z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
class LongOperation extends AsyncTask<MyTaskParams, Void, String> {

    @Override
    protected String doInBackground(MyTaskParams... params) {
        try {
            Socket socket = new Socket("192.168.43.232", 4000);
            String data = URLEncoder.encode("AccXYZ", "UTF-8") + "=" + URLEncoder.encode(String.valueOf(params[0].x)+"_"+String.valueOf(params[0].y)+"_"+String.valueOf(params[0].z), "UTF-8");

            String path = "/data";
            BufferedWriter wr = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF8"));
            wr.write("POST " + path + " HTTP/1.0\r\n");
            wr.write("Content-Length: " + data.length() + "\r\n");
            wr.write("Content-Type: application/x-www-form-urlencoded\r\n");
            wr.write("\r\n");

            wr.write(data);
            wr.flush();
            wr.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return "Executed";
}

    @Override
    protected void onPostExecute(String result) {

    }

    @Override
    protected void onPreExecute() {}

    @Override
    protected void onProgressUpdate(Void... values) {}
}
