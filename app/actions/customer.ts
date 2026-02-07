"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { uploadToCloudinary } from "@/lib/cloudinary"; 
import { sendNotification } from "@/lib/notifications"; // <--- Import Helper

// 1. GET FULL PROFILE (Returns Data Object + Status)
export async function getCustomerProfile(userId: string) {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
  });
  return profile;
}

// 2. REGISTER CUSTOMER
export async function registerCustomer(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const uploadFile = async (key: string) => {
    const file = formData.get(key) as File;
    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const result = await uploadToCloudinary(buffer);
      return result.secure_url;
    }
    return "";
  };

  try {
    const gstCertUrl = await uploadFile("gstCertificate");
    const msmeCertUrl = await uploadFile("msmeCertificate");
    const panCardUrl = await uploadFile("panCard");
    const aadharCardUrl = await uploadFile("aadharCard");
    const ownerPhotoUrl = await uploadFile("ownerPhoto");
    const cancelledChequeUrl = await uploadFile("cancelledCheque");
    const locationPhotoUrl = await uploadFile("locationImage");
    const backup1IdUrl = await uploadFile("backup1IdProof");
    const backup2IdUrl = await uploadFile("backup2IdProof");

    const fullName = formData.get("fullName") as string;
    const companyName = formData.get("companyName") as string;

    await prisma.customerProfile.create({
      data: {
        userId,
        status: "PENDING", // <--- FORCE PENDING STATUS START

        // Basic
        fullName: fullName,
        companyName: companyName,
        phone: formData.get("phone") as string,
        email: formData.get("email") as string,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        postalCode: formData.get("postalCode") as string,

        // Business
        category: formData.get("businessType") as string, 
        businessType: "Proprietorship", 
        yearsInBusiness: formData.get("yearsInBusiness") as string,
        gstNumber: formData.get("gstNumber") as string,
        tradeLicense: formData.get("tradeLicense") as string,

        // Docs
        gstCertificateUrl: gstCertUrl,
        msmeCertificateUrl: msmeCertUrl,
        panCardUrl: panCardUrl,
        aadharCardUrl: aadharCardUrl,
        ownerPhotoUrl: ownerPhotoUrl,

        // Banking
        bankName: formData.get("bankName") as string,
        accountHolder: formData.get("accountHolder") as string,
        accountNumber: formData.get("accountNumber") as string,
        ifscCode: formData.get("ifscCode") as string,
        cancelledChequeUrl: cancelledChequeUrl,

        // Backups
        backup1Name: formData.get("backup1Name") as string,
        backup1Phone: formData.get("backup1Phone") as string,
        backup1IdUrl: backup1IdUrl,
        backup2Name: formData.get("backup2Name") as string,
        backup2Phone: formData.get("backup2Phone") as string,
        backup2IdUrl: backup2IdUrl,

        // Location
        gpsLat: parseFloat(formData.get("gpsLat") as string) || 0,
        gpsLng: parseFloat(formData.get("gpsLng") as string) || 0,
        locationPhotoUrl: locationPhotoUrl,
      }
    });

    // --- 3. NOTIFY ADMIN ---
    // Alerts the admin that a new B2B Customer has registered.
    await sendNotification("VENDOR_REGISTERED", {
        name: `${companyName} (${fullName}) [Customer]`, 
        toEmail: null, // Logic handles sending to Admin
        orderId: ""    
    });

    return { success: true };
  } catch (error) {
    console.error("Customer Registration Error:", error);
    return { success: false, error: "Failed to create profile" };
  }
}