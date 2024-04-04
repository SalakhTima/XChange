﻿using API.DAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.DAL.Configurations;

internal class LetterConfiguration : IEntityTypeConfiguration<Letter>
{
    public void Configure(EntityTypeBuilder<Letter> builder)
    {
        builder.HasKey(l => l.Id);

        builder
            .HasOne(l => l.Sender)
            .WithMany(u => u.Sent)
            .OnDelete(DeleteBehavior.SetNull);

        builder
            .HasOne(l => l.Receiver)
            .WithMany(u => u.Received)
            .OnDelete(DeleteBehavior.Restrict);
    }
}